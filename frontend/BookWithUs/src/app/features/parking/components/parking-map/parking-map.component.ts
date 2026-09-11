import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../../../core/services/parking/parking.service';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { ParkingAvailabilityDto, ParkingZoneDto } from '../../../../core/models/parking/parking-slot.model';
import { ParkingSlotComponent } from '../parking-slot/parking-slot.component';
import { SlotCodePipe } from '../../../../shared/pipes/slot-code.pipe';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-parking-map',
  standalone: true,
  imports: [
    CommonModule,
    ParkingSlotComponent,
    SlotCodePipe,
    LoadingSpinnerComponent
  ],
  templateUrl: './parking-map.component.html',
  styleUrls: ['./parking-map.component.css']
})
export class ParkingMapComponent implements OnInit, OnChanges {
  private parkingService = inject(ParkingService);
  bookingState = inject(BookingStateService);

  @Input({ required: true }) eventId!: number;
  @Input() selectedVehicleType = 'Car';

  @Output() slotSelected = new EventEmitter<ParkingAvailabilityDto | null>();
  @Output() conflictOccurred = new EventEmitter<string>();

  slots: ParkingAvailabilityDto[] = [];
  filteredSlots: ParkingAvailabilityDto[] = [];
  zones: ParkingZoneDto[] = [];
  selectedZone = 'all';
  isLoading = true;
  errorMessage = '';
  hoveredSlot: ParkingAvailabilityDto | null = null;

  ngOnInit(): void {
    if (this.eventId) {
      this.loadParking(this.eventId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId'] && !changes['eventId'].firstChange) {
      this.loadParking(this.eventId);
    }
    if (changes['selectedVehicleType'] && !changes['selectedVehicleType'].firstChange) {
      this.filterSlots();
    }
  }

  loadParking(eventId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.parkingService.getEventParkingSlots(eventId).subscribe({
      next: (data) => {
        this.slots = data || [];
        this.reconcileSelectedSlot(this.slots);
        this.filterSlots();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Could not load parking slots for this event.';
      }
    });

    this.parkingService.getEventParkingZones(eventId).subscribe({
      next: (zonesData) => {
        this.zones = zonesData || [];
      },
      error: () => {}
    });
  }

  reconcileSelectedSlot(freshSlots: ParkingAvailabilityDto[]): void {
    const current = this.bookingState.currentState.selectedParking;
    if (current) {
      const currentId = current.id ?? current.slotId;
      const fresh = freshSlots.find(s => (s.id ?? s.slotId) === currentId);
      if (!fresh || fresh.status !== 'Available') {
        this.bookingState.handleParkingConflict(currentId);
        this.conflictOccurred.emit('Your selected parking stall is no longer available and was cleared.');
        this.slotSelected.emit(null);
      }
    }
  }

  setZone(zone: string): void {
    this.selectedZone = zone;
    this.filterSlots();
  }

  filterSlots(): void {
    let list = [...this.slots];
    if (this.selectedZone !== 'all') {
      list = list.filter(s =>
        s.zoneName.toLowerCase().includes(this.selectedZone.toLowerCase()) ||
        String(s.zoneId) === this.selectedZone
      );
    }
    this.filteredSlots = list;
  }

  isSlotSelected(slotId: number): boolean {
    const current = this.bookingState.currentState.selectedParking;
    return !!current && ((current.id ?? current.slotId) === slotId);
  }

  onSlotClick(slot: ParkingAvailabilityDto): void {
    if (slot.status !== 'Available') return;

    const slotId = slot.id ?? slot.slotId ?? 0;
    if (this.isSlotSelected(slotId)) {
      // Deselect
      this.bookingState.selectParking(null);
      this.slotSelected.emit(null);
    } else {
      // Select new slot (replaces previous selection)
      this.bookingState.selectParking(slot);
      this.slotSelected.emit(slot);
    }
  }

  handleConflict(conflictingSlotId?: number): void {
    this.bookingState.handleParkingConflict(conflictingSlotId);
    this.loadParking(this.eventId);
    this.conflictOccurred.emit('Parking availability changed. Map refreshed.');
  }
}

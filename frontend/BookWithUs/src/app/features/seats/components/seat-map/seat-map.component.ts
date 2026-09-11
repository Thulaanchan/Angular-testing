import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatService } from '../../../../core/services/seats/seat.service';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { SeatAvailabilityDto } from '../../../../core/models/seats/seat.model';
import { SeatItemComponent } from '../seat-item/seat-item.component';
import { SeatLabelPipe } from '../../../../shared/pipes/seat-label.pipe';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [
    CommonModule,
    SeatItemComponent,
    SeatLabelPipe,
    LoadingSpinnerComponent
  ],
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.css']
})
export class SeatMapComponent implements OnInit, OnChanges {
  private seatService = inject(SeatService);
  bookingState = inject(BookingStateService);

  @Input({ required: true }) eventId!: number;

  @Output() seatSelected = new EventEmitter<SeatAvailabilityDto>();
  @Output() selectionChange = new EventEmitter<SeatAvailabilityDto[]>();
  @Output() conflictOccurred = new EventEmitter<string>();

  seats: SeatAvailabilityDto[] = [];
  sections: { name: string; tier: string; seats: SeatAvailabilityDto[] }[] = [];
  isLoading = true;
  errorMessage = '';
  zoomLevel = 1.0;
  hoveredSeat: SeatAvailabilityDto | null = null;

  ngOnInit(): void {
    if (this.eventId) {
      this.loadSeats(this.eventId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId'] && !changes['eventId'].firstChange) {
      this.loadSeats(this.eventId);
    }
  }

  loadSeats(eventId: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.seatService.getEventSeats(eventId).subscribe({
      next: (data) => {
        this.seats = data || [];
        this.groupSeatsBySection(this.seats);
        this.reconcileSelectedSeats(this.seats);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Could not load seats for this event.';
      }
    });
  }

  groupSeatsBySection(allSeats: SeatAvailabilityDto[]): void {
    const map = new Map<string, { name: string; tier: string; seats: SeatAvailabilityDto[] }>();

    for (const seat of allSeats) {
      const tierName = seat.categoryName || seat.tierName || 'Standard';
      const sectionName = seat.sectionName || tierName;
      if (!map.has(sectionName)) {
        map.set(sectionName, {
          name: sectionName,
          tier: tierName,
          seats: []
        });
      }
      map.get(sectionName)!.seats.push(seat);
    }

    this.sections = Array.from(map.values());
  }

  reconcileSelectedSeats(freshSeats: SeatAvailabilityDto[]): void {
    const selected = this.bookingState.currentState.selectedSeats;
    const conflictingIds: number[] = [];

    for (const sel of selected) {
      const fresh = freshSeats.find(s => (s.id || s.seatId) === sel.seatId);
      if (!fresh || fresh.status !== 'Available') {
        conflictingIds.push(sel.seatId);
      }
    }

    if (conflictingIds.length > 0) {
      this.bookingState.handleSeatConflict(conflictingIds);
      this.conflictOccurred.emit('Some selected seats are no longer available and were removed.');
    }
  }

  isSeatSelected(seatId: number): boolean {
    return this.bookingState.currentState.selectedSeats.some(s => s.seatId === seatId);
  }

  onSeatClick(seat: SeatAvailabilityDto): void {
    if (seat.status !== 'Available') return;

    const seatId = seat.id ?? seat.seatId ?? 0;
    const alreadySelected = this.isSeatSelected(seatId);

    if (!alreadySelected && this.bookingState.currentState.selectedSeats.length >= this.bookingState.totalSeatsRequired) {
      return; // Reached limit
    }

    this.bookingState.toggleSeat(seat);
    this.seatSelected.emit(seat);
  }

  handleConflict(conflictingIds?: number[]): void {
    if (conflictingIds && conflictingIds.length > 0) {
      this.bookingState.handleSeatConflict(conflictingIds);
    }
    this.loadSeats(this.eventId);
    this.conflictOccurred.emit('Seat layout updated after conflict resolution.');
  }

  zoomIn(): void {
    if (this.zoomLevel < 1.4) this.zoomLevel += 0.1;
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.8) this.zoomLevel -= 0.1;
  }

  resetZoom(): void {
    this.zoomLevel = 1.0;
  }
}

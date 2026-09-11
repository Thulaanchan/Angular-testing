import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ParkingService } from '../../../../core/services/parking/parking.service';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { ParkingAvailabilityDto, ParkingZoneDto } from '../../../../core/models/parking/parking-slot.model';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LiveBookingSummaryComponent } from '../../../../shared/components/live-booking-summary/live-booking-summary.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-parking-selection-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BookingStepperComponent,
    LiveBookingSummaryComponent,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './parking-selection-page.component.html',
  styleUrls: ['./parking-selection-page.component.css']
})
export class ParkingSelectionPageComponent implements OnInit {
  private parkingService = inject(ParkingService);
  bookingState = inject(BookingStateService);
  private router = inject(Router);

  slots: ParkingAvailabilityDto[] = [];
  filteredSlots: ParkingAvailabilityDto[] = [];
  zones: ParkingZoneDto[] = [];
  isLoading = true;

  selectedVehicleType: string = 'car';
  selectedZone: string = 'all';

  showConflictDialog = false;
  conflictMessage = '';

  vehicleTypes = [
    { type: 'car', label: 'Car', fee: 15, icon: 'car' },
    { type: 'van', label: 'Van / SUV', fee: 20, icon: 'van' },
    { type: 'motorbike', label: 'Motorbike', fee: 5, icon: 'bike' },
    { type: 'three-wheeler', label: 'Three-Wheeler', fee: 8, icon: 'tuk' }
  ];

  ngOnInit(): void {
    const event = this.bookingState.currentState.event;
    const venueId = event?.venueId || 1;
    this.loadParkingSlots(venueId);
  }

  loadParkingSlots(venueId: number): void {
    this.isLoading = true;
    this.parkingService.getVenueParkingSlots(venueId).subscribe({
      next: (data: ParkingAvailabilityDto[]) => {
        this.slots = data;
        this.filterSlots();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setVehicleType(type: string): void {
    this.selectedVehicleType = type;
    this.filterSlots();
  }

  setZone(zone: string): void {
    this.selectedZone = zone;
    this.filterSlots();
  }

  filterSlots(): void {
    let list = [...this.slots];
    if (this.selectedZone !== 'all') {
      list = list.filter(s => s.zoneName.toLowerCase() === this.selectedZone.toLowerCase());
    }
    this.filteredSlots = list;
  }

  isSlotSelected(slotId: number | undefined): boolean {
    if (slotId === undefined) return false;
    const current = this.bookingState.currentState.selectedParking;
    return (current?.slotId ?? current?.id) === slotId;
  }

  onSlotClick(slot: ParkingAvailabilityDto): void {
    if (slot.status !== 'Available') return;
    const slotId = slot.slotId ?? slot.id;

    if (this.isSlotSelected(slotId)) {
      this.bookingState.selectParking(null);
    } else {
      // Apply vehicle type fee
      const v = this.vehicleTypes.find(x => x.type === this.selectedVehicleType);
      const slotWithCustomVehicle: ParkingAvailabilityDto = {
        ...slot,
        slotId: slotId,
        vehicleType: this.selectedVehicleType,
        fee: v ? v.fee : slot.fee
      };
      this.bookingState.selectParking(slotWithCustomVehicle);
    }
  }

  skipParking(): void {
    this.bookingState.selectParking(null);
    this.router.navigate(['/booking/review']);
  }

  continueToReview(): void {
    this.router.navigate(['/booking/review']);
  }
}

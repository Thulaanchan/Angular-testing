import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../core/services/events/event.service';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LiveBookingSummaryComponent } from '../../../../shared/components/live-booking-summary/live-booking-summary.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ParkingMapComponent } from '../../components/parking-map/parking-map.component';

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
    ConfirmationDialogComponent,
    ParkingMapComponent
  ],
  templateUrl: './parking-selection-page.component.html',
  styleUrls: ['./parking-selection-page.component.css']
})
export class ParkingSelectionPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  bookingState = inject(BookingStateService);

  @ViewChild(ParkingMapComponent) parkingMapComponent?: ParkingMapComponent;

  eventId = 1;
  isLoadingEvent = true;
  selectedVehicleType = 'Car';

  showConflictDialog = false;
  conflictMessage = '';

  vehicleTypes = [
    { type: 'Car', label: 'Car', fee: 1500 },
    { type: 'Van', label: 'Van / SUV', fee: 2500 },
    { type: 'Motorbike', label: 'Motorbike', fee: 500 },
    { type: 'Three-Wheeler', label: 'Three-Wheeler', fee: 800 }
  ];

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const paramEventId = routeId ? parseInt(routeId, 10) : null;
    const currentEvent = this.bookingState.currentState.event;
    const existingEventId = currentEvent ? (currentEvent.eventId || currentEvent.id) : null;

    const targetEventId = paramEventId || existingEventId || 1;
    this.eventId = targetEventId;

    if (!currentEvent || (currentEvent.id !== targetEventId && currentEvent.eventId !== targetEventId)) {
      this.isLoadingEvent = true;
      this.eventService.getEventById(targetEventId).subscribe({
        next: (event) => {
          this.bookingState.setEvent(event);
          this.eventId = event.eventId || event.id;
          this.isLoadingEvent = false;
        },
        error: () => {
          this.isLoadingEvent = false;
        }
      });
    } else {
      this.isLoadingEvent = false;
    }
  }

  setVehicleType(type: string): void {
    this.selectedVehicleType = type;
  }

  onConflict(message: string): void {
    this.conflictMessage = message;
    this.showConflictDialog = true;
  }

  onRefreshAfterConflict(): void {
    this.showConflictDialog = false;
    if (this.parkingMapComponent) {
      this.parkingMapComponent.loadParking(this.eventId);
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

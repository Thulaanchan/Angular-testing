import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeatService } from '../../../../core/services/seats/seat.service';
import { EventService } from '../../../../core/services/events/event.service';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { SeatAvailabilityDto } from '../../../../core/models/seats/seat.model';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LiveBookingSummaryComponent } from '../../../../shared/components/live-booking-summary/live-booking-summary.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SeatMapComponent } from '../../components/seat-map/seat-map.component';

@Component({
  selector: 'app-seat-selection-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BookingStepperComponent,
    LiveBookingSummaryComponent,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    SeatMapComponent
  ],
  templateUrl: './seat-selection-page.component.html',
  styleUrls: ['./seat-selection-page.component.css']
})
export class SeatSelectionPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  bookingState = inject(BookingStateService);

  @ViewChild(SeatMapComponent) seatMapComponent?: SeatMapComponent;

  eventId = 1;
  isLoadingEvent = true;
  showConflictDialog = false;
  conflictMessage = '';

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

  onConflict(message: string): void {
    this.conflictMessage = message;
    this.showConflictDialog = true;
  }

  onRefreshAfterConflict(): void {
    this.showConflictDialog = false;
    if (this.seatMapComponent) {
      this.seatMapComponent.loadSeats(this.eventId);
    }
  }

  get canProceed(): boolean {
    const s = this.bookingState.currentState;
    return s.selectedSeats.length === (s.adultCount + s.childCount) && s.selectedSeats.length > 0;
  }

  proceedToParking(): void {
    if (!this.canProceed) return;
    this.router.navigate(['/booking/parking']);
  }

  incrementAdults(): void {
    const cur = this.bookingState.currentState;
    this.bookingState.setTicketRequirements(cur.adultCount + 1, cur.childCount);
  }

  decrementAdults(): void {
    const cur = this.bookingState.currentState;
    if (cur.adultCount > 1) {
      this.bookingState.setTicketRequirements(cur.adultCount - 1, cur.childCount);
    }
  }

  incrementChildren(): void {
    const cur = this.bookingState.currentState;
    this.bookingState.setTicketRequirements(cur.adultCount, cur.childCount + 1);
  }

  decrementChildren(): void {
    const cur = this.bookingState.currentState;
    if (cur.childCount > 0) {
      this.bookingState.setTicketRequirements(cur.adultCount, cur.childCount - 1);
    }
  }
}

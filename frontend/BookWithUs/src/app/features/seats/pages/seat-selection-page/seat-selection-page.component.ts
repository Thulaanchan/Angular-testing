import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SeatService } from '../../../../core/services/seats/seat.service';
import { EventService } from '../../../../core/services/events/event.service';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { SeatAvailabilityDto } from '../../../../core/models/seats/seat.model';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LiveBookingSummaryComponent } from '../../../../shared/components/live-booking-summary/live-booking-summary.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-seat-selection-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BookingStepperComponent,
    LiveBookingSummaryComponent,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './seat-selection-page.component.html',
  styleUrls: ['./seat-selection-page.component.css']
})
export class SeatSelectionPageComponent implements OnInit {
  private seatService = inject(SeatService);
  private eventService = inject(EventService);
  bookingState = inject(BookingStateService);
  private router = inject(Router);

  seats: SeatAvailabilityDto[] = [];
  sections: { name: string; tier: string; seats: SeatAvailabilityDto[] }[] = [];
  isLoading = true;
  zoomLevel = 1.0;

  hoveredSeat: SeatAvailabilityDto | null = null;
  showConflictDialog = false;
  conflictMessage = '';

  ngOnInit(): void {
    // Ensure event is selected in state
    if (!this.bookingState.currentState.event) {
      this.eventService.getEventById(1).subscribe({
        next: (event) => {
          this.bookingState.setEvent(event);
          const eId = event.eventId || event.id;
          this.loadSeats(eId);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      const curEvent = this.bookingState.currentState.event;
      const eId = curEvent.eventId || curEvent.id;
      this.loadSeats(eId);
    }
  }

  loadSeats(eventId: number): void {
    this.isLoading = true;
    this.seatService.getEventSeats(eventId).subscribe({
      next: (data) => {
        this.seats = data;
        this.groupSeatsBySection(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  groupSeatsBySection(allSeats: SeatAvailabilityDto[]): void {
    const map = new Map<string, { name: string; tier: string; seats: SeatAvailabilityDto[] }>();

    for (const seat of allSeats) {
      const tierName = seat.tierName || seat.categoryName || 'Standard';
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

  isSeatSelected(seatId: number): boolean {
    return this.bookingState.currentState.selectedSeats.some(s => s.seatId === seatId);
  }

  onSeatClick(seat: SeatAvailabilityDto): void {
    if (seat.status !== 'Available') return;

    const seatId = seat.seatId ?? seat.id;
    const alreadySelected = this.isSeatSelected(seatId);
    if (!alreadySelected && this.bookingState.currentState.selectedSeats.length >= this.bookingState.totalSeatsRequired) {
      return; // Reached limit
    }

    this.bookingState.toggleSeat({
      ...seat,
      seatId,
      seatNumber: seat.seatNumber ?? seat.number,
      price: seat.price ?? seat.adultPrice,
      tierName: seat.tierName ?? seat.categoryName
    });
  }

  get canProceed(): boolean {
    const s = this.bookingState.currentState;
    return s.selectedSeats.length === (s.adultCount + s.childCount) && s.selectedSeats.length > 0;
  }

  proceedToParking(): void {
    if (!this.canProceed) return;
    this.router.navigate(['/booking/parking']);
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

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingStateService } from '../../../core/services/bookings/booking-state.service';
import { AttendeeType } from '../../../core/models/bookings/attendee-type.model';

@Component({
  selector: 'app-live-booking-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './live-booking-summary.component.html',
  styleUrls: ['./live-booking-summary.component.css']
})
export class LiveBookingSummaryComponent {
  bookingState = inject(BookingStateService);
  AttendeeType = AttendeeType;

  @Input() actionLabel: string = 'Continue';
  @Input() canProceed: boolean = true;
  @Input() showAction: boolean = true;
  @Input() isLoading: boolean = false;

  @Output() proceed = new EventEmitter<void>();

  onProceed(): void {
    if (this.canProceed && !this.isLoading) {
      this.proceed.emit();
    }
  }

  get adultSeats() {
    return this.bookingState.currentState.selectedSeats.filter(s => s.attendeeType === AttendeeType.Adult);
  }

  get childSeats() {
    return this.bookingState.currentState.selectedSeats.filter(s => s.attendeeType === AttendeeType.Child);
  }
}

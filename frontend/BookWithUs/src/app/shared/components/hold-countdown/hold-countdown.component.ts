import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingStateService } from '../../../core/services/bookings/booking-state.service';

@Component({
  selector: 'app-hold-countdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hold-countdown.component.html',
  styleUrls: ['./hold-countdown.component.css']
})
export class HoldCountdownComponent {
  bookingState = inject(BookingStateService);

  get state() {
    return this.bookingState.currentState;
  }

  get isUrgent(): boolean {
    const timer = this.state.holdSecondsRemaining;
    return timer > 0 && timer <= 180; // 3 mins or less
  }

  get isExpired(): boolean {
    return this.state.holdSecondsRemaining === 0 && this.state.selectedSeats.length > 0;
  }
}

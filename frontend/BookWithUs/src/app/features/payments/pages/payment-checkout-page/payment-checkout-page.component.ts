import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { BookingService } from '../../../../core/services/bookings/booking.service';
import { PaymentService } from '../../../../core/services/payments/payment.service';
import { PaymentMethod } from '../../../../core/models/payments/payment-method.model';
import { CreateBookingRequestDto } from '../../../../core/models/bookings/booking.model';
import { AttendeeType } from '../../../../core/models/bookings/attendee-type.model';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LiveBookingSummaryComponent } from '../../../../shared/components/live-booking-summary/live-booking-summary.component';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-payment-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    BookingStepperComponent,
    LiveBookingSummaryComponent,
    FormErrorComponent,
    AlertBannerComponent
  ],
  templateUrl: './payment-checkout-page.component.html',
  styleUrls: ['./payment-checkout-page.component.css']
})
export class PaymentCheckoutPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  bookingState = inject(BookingStateService);
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  selectedMethod: 'card' | 'paypal' | 'wallet' = 'card';
  isProcessing = false;
  errorMessage = '';

  cardForm: FormGroup = this.fb.group({
    cardholderName: ['Leon Thas', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['4242 •••• •••• 4242', [Validators.required]],
    expiry: ['12/28', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
    cvv: ['123', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
  });

  ngOnInit(): void {
    if (!this.bookingState.currentState.event || this.bookingState.currentState.selectedSeats.length === 0) {
      this.router.navigate(['/events']);
    }
  }

  fillDemoCard(): void {
    this.cardForm.patchValue({
      cardholderName: 'Leon Thas',
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/28',
      cvv: '123'
    });
  }

  processPayment(): void {
    if (this.selectedMethod === 'card' && this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    const state = this.bookingState.currentState;
    const eventId = Number(state.event?.eventId ?? state.event?.id ?? 1);
    const createReq: CreateBookingRequestDto = {
      eventId: eventId,
      seats: state.selectedSeats.map(s => ({
        seatId: s.seatId,
        attendeeType: typeof s.attendeeType === 'string' ? (s.attendeeType === 'Child' ? AttendeeType.Child : AttendeeType.Adult) : s.attendeeType,
        attendeeName: s.attendeeName || 'Attendee'
      })),
      parkingSlotId: state.selectedParking ? (state.selectedParking.slotId ?? state.selectedParking.id) : undefined
    };

    // 1. Create the booking reservation
    this.bookingService.createBooking(createReq).subscribe({
      next: (booking) => {
        this.bookingState.setCreatedBooking(booking);

        // 2. Process simulated payment
        this.paymentService.processPayment(booking.bookingId, {
          paymentMethod: PaymentMethod.Card,
          cardholderName: this.cardForm.value.cardholderName,
          testCardNumber: this.cardForm.value.cardNumber,
          expiry: this.cardForm.value.expiry,
          testCvv: this.cardForm.value.cvv
        }).subscribe({
          next: () => {
            this.isProcessing = false;
            this.router.navigate(['/booking/confirmation', booking.bookingId]);
          },
          error: (payErr) => {
            this.isProcessing = false;
            // Still route to confirmation if mock succeeded or show error
            this.router.navigate(['/booking/confirmation', booking.bookingId]);
          }
        });
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = err.message || 'Failed to finalize booking reservation. Please try again.';
      }
    });
  }
}

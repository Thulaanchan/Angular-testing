import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { BookingService } from '../../../../core/services/bookings/booking.service';
import { PaymentService } from '../../../../core/services/payments/payment.service';
import { PaymentMethod } from '../../../../core/models/payments/payment-method.model';
import { BookingPaymentDto, ProcessPaymentRequestDto } from '../../../../core/models/payments/payment.model';
import { CreateBookingRequestDto } from '../../../../core/models/bookings/booking.model';
import { AttendeeType } from '../../../../core/models/bookings/attendee-type.model';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LiveBookingSummaryComponent } from '../../../../shared/components/live-booking-summary/live-booking-summary.component';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';
import { cardChecksumValidator } from '../../../../shared/validators/card-checksum.validator';
import { expiryFormatValidator } from '../../../../shared/validators/expiry-format.validator';
import { expiryInFutureValidator } from '../../../../shared/validators/expiry-in-future.validator';

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
  bookingPayment: BookingPaymentDto | null = null;
  authoritativeAmount: number | null = null;

  cardForm: FormGroup = this.fb.group({
    cardholderName: ['Leon Thas', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['4242 4242 4242 4242', [Validators.required, cardChecksumValidator()]],
    expiry: ['12/28', [Validators.required, expiryFormatValidator(), expiryInFutureValidator()]],
    cvv: ['123', [Validators.required, Validators.pattern(/^\d{3}$/)]]
  });

  ngOnInit(): void {
    if (!this.bookingState.currentState.event || this.bookingState.currentState.selectedSeats.length === 0) {
      this.router.navigate(['/events']);
      return;
    }

    const existingBookingId = this.bookingState.currentState.createdBooking?.bookingId;
    if (existingBookingId) {
      this.loadBookingPayment(existingBookingId);
    }
  }

  loadBookingPayment(bookingId: number): void {
    this.paymentService.getBookingPayment(bookingId).subscribe({
      next: (dto: BookingPaymentDto) => {
        this.bookingPayment = dto;
        this.authoritativeAmount = dto.amountDue;
        if (dto.isExpired) {
          this.errorMessage = 'This booking hold has expired. Please return to select your seats again.';
        } else if (!dto.canPay) {
          this.errorMessage = 'This booking cannot be paid or has already been completed.';
        }
      },
      error: (err) => {
        // Fallback to state amount if payment due cannot be loaded
        this.authoritativeAmount = this.bookingState.totalAmount;
      }
    });
  }

  fillDemoCard(): void {
    this.cardForm.patchValue({
      cardholderName: 'Leon Thas',
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/28',
      cvv: '123'
    });
    this.cardForm.markAsDirty();
  }

  processPayment(): void {
    if (this.isProcessing) return;

    if (this.selectedMethod === 'card' && this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    if (this.bookingPayment && (!this.bookingPayment.canPay || this.bookingPayment.isExpired)) {
      this.errorMessage = this.bookingPayment.isExpired
        ? 'This booking hold has expired. Please select seats again.'
        : 'This booking is not available for payment.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    const state = this.bookingState.currentState;
    const existingBookingId = state.createdBooking?.bookingId;

    const executePayment = (bookingId: number) => {
      const cleanCard = String(this.cardForm.value.cardNumber || '').replace(/[\s-]/g, '');
      const request: ProcessPaymentRequestDto = {
        paymentMethod: this.selectedMethod === 'card' ? PaymentMethod.Card : PaymentMethod.MobileWallet,
        cardholderName: this.cardForm.value.cardholderName,
        testCardNumber: cleanCard,
        expiry: this.cardForm.value.expiry,
        testCvv: this.cardForm.value.cvv
      };

      this.paymentService.processPayment(bookingId, request).subscribe({
        next: () => {
          // Re-fetch authoritative booking state (Task 10)
          this.bookingService.getBookingById(bookingId).subscribe({
            next: (confirmedBooking) => {
              this.bookingState.setCreatedBooking(confirmedBooking);
              this.isProcessing = false;
              this.router.navigate(['/booking/confirmation', bookingId]);
            },
            error: () => {
              this.isProcessing = false;
              this.router.navigate(['/booking/confirmation', bookingId]);
            }
          });
        },
        error: (payErr) => {
          this.isProcessing = false;
          this.errorMessage = payErr.error?.message ||
            (typeof payErr.error === 'string' ? payErr.error : null) ||
            'Payment processing failed. Please try again.';
        }
      });
    };

    if (existingBookingId) {
      executePayment(existingBookingId);
    } else {
      const eventId = Number(state.event?.eventId ?? state.event?.id ?? 1);
      const createReq: CreateBookingRequestDto = {
        eventId: eventId,
        seats: state.selectedSeats.map(s => ({
          seatId: s.seatId,
          attendeeType: typeof s.attendeeType === 'string' ? (s.attendeeType === 'Child' ? AttendeeType.Child : AttendeeType.Adult) : (s.attendeeType || AttendeeType.Adult),
          attendeeName: s.attendeeName || 'Attendee'
        })),
        parkingSlotId: state.selectedParking ? (state.selectedParking.slotId ?? state.selectedParking.id) : undefined
      };

      this.bookingService.createBooking(createReq).subscribe({
        next: (booking) => {
          this.bookingState.setCreatedBooking(booking);
          this.loadBookingPayment(booking.bookingId);
          executePayment(booking.bookingId);
        },
        error: (err) => {
          this.isProcessing = false;
          this.errorMessage = err.error?.message ||
            (typeof err.error === 'string' ? err.error : null) ||
            'Failed to create booking reservation.';
        }
      });
    }
  }
}

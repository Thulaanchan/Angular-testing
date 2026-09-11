import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { BookingPaymentDto, PaymentHistoryDto, PaymentReceiptDto, PaymentResultDto, ProcessPaymentRequestDto } from '../../models/payments/payment.model';
import { MockDataService } from '../mock-data.service';
import { PaymentStatus } from '../../models/payments/payment-status.model';
import { PaymentMethod } from '../../models/payments/payment-method.model';
import { BookingStatus } from '../../models/bookings/booking-status.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private authService = inject(AuthService);

  getBookingPayment(bookingId: number): Observable<BookingPaymentDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<BookingPaymentDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.payments.bookingPayment(bookingId)}`);
    }
    return of(this.getMockBookingPayment(bookingId));
  }

  processPayment(bookingId: number, request: ProcessPaymentRequestDto): Observable<PaymentResultDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<PaymentResultDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.payments.bookingPayment(bookingId)}`, request);
    }
    return of(this.processMockPayment(bookingId, request));
  }

  getCustomerPaymentHistory(customerId?: number): Observable<PaymentHistoryDto[]> {
    const targetId = customerId || this.authService.getCustomerId() || 1;
    if (!API_CONFIG.useMockData) {
      return this.http.get<PaymentHistoryDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.payments.customerHistory(targetId)}`);
    }
    return of(this.mockData.payments);
  }

  getCustomerPayments(customerId?: number): Observable<PaymentHistoryDto[]> {
    return this.getCustomerPaymentHistory(customerId);
  }

  getReceipt(paymentId: number): Observable<PaymentReceiptDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<PaymentReceiptDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.payments.receipt(paymentId)}`);
    }
    return of(this.getMockReceipt(paymentId));
  }

  getAllPayments(): Observable<PaymentHistoryDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<PaymentHistoryDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.payments.all}`);
    }
    return of(this.mockData.payments);
  }

  private getMockBookingPayment(bookingId: number): BookingPaymentDto {
    const booking = this.mockData.bookings.find(b => b.bookingId === bookingId) || this.mockData.bookings[0];
    return {
      bookingId: booking.bookingId,
      bookingNumber: booking.bookingNumber,
      amountDue: booking.totalAmount || 33000,
      currency: 'LKR',
      paymentStatus: PaymentStatus.Pending,
      bookingStatus: BookingStatus.Pending,
      holdExpiresAtUtc: booking.holdExpiresAtUtc,
      isExpired: false,
      canPay: true
    };
  }

  private processMockPayment(bookingId: number, request: ProcessPaymentRequestDto): PaymentResultDto {
    const booking = this.mockData.bookings.find(b => b.bookingId === bookingId) || this.mockData.bookings[0];
    booking.bookingStatus = BookingStatus.Confirmed;

    const paymentId = this.mockData.payments.length + 1;
    const paymentRecord: PaymentHistoryDto = {
      paymentId,
      bookingId: booking.bookingId,
      bookingNumber: booking.bookingNumber,
      eventName: booking.event?.eventName || 'Rockstar Aniruth Musical Show - 2026',
      venueName: booking.event?.venueName || 'Unicom TIC, Jaffna',
      customerName: 'Leo Thas',
      amountPaid: booking.totalAmount || 33000,
      currency: 'LKR',
      paymentMethod: request.paymentMethod || PaymentMethod.Card,
      paymentStatus: PaymentStatus.Completed,
      paidAtUtc: new Date().toISOString()
    };

    this.mockData.payments.unshift(paymentRecord);

    return {
      paymentId,
      bookingId: booking.bookingId,
      bookingNumber: booking.bookingNumber,
      amountPaid: paymentRecord.amountPaid,
      currency: 'LKR',
      paymentStatus: PaymentStatus.Completed,
      paidAtUtc: paymentRecord.paidAtUtc,
      message: 'Payment completed successfully. Your booking is confirmed.'
    };
  }

  private getMockReceipt(paymentId: number): PaymentReceiptDto {
    const payment = this.mockData.payments.find(p => p.paymentId === paymentId) || this.mockData.payments[0];
    const booking = this.mockData.bookings.find(b => b.bookingId === payment.bookingId) || this.mockData.bookings[0];

    return {
      paymentId: payment.paymentId,
      bookingId: booking.bookingId,
      bookingNumber: booking.bookingNumber,
      customerName: payment.customerName || 'Leo Thas',
      eventName: payment.eventName,
      eventDateTime: booking.event?.eventDate ? `${booking.event.eventDate}T${booking.event.startTime}` : '2026-09-12T12:00:00Z',
      venueName: payment.venueName,
      seatAmount: 32500,
      parkingAmount: 500,
      totalAmount: payment.amountPaid,
      currency: 'LKR',
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      paidAtUtc: payment.paidAtUtc
    };
  }
}

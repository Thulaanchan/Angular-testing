import { PaymentMethod } from './payment-method.model';
import { PaymentStatus } from './payment-status.model';
import { BookingStatus } from '../bookings/booking-status.model';

export interface BookingPaymentDto {
  bookingId: number;
  bookingNumber: string;
  amountDue: number;
  currency: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  holdExpiresAtUtc?: string;
  isExpired: boolean;
  canPay: boolean;
}

export interface PaymentHistoryDto {
  paymentId: number;
  transactionId?: string;
  bookingId: number;
  bookingNumber: string;
  bookingReference?: string;
  eventName: string;
  eventTitle?: string;
  venueName: string;
  customerName?: string;
  amountPaid: number;
  amount?: number;
  currency: string;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus | string;
  status?: string;
  paidAtUtc: string;
  paymentDate?: string;
}

export interface PaymentReceiptDto {
  paymentId: number;
  bookingId: number;
  bookingNumber: string;
  bookingReference?: string;
  receiptNumber?: string;
  customerName: string;
  customerEmail?: string;
  eventName: string;
  eventTitle?: string;
  eventDateTime: string;
  eventDate?: string;
  venueName: string;
  seatAmount: number;
  seatsSubtotal?: number;
  seatSummary?: string;
  parkingAmount: number;
  parkingFee?: number;
  parkingSummary?: string;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus | string;
  status?: string;
  paidAtUtc: string;
  paymentDate?: string;
}

export interface PaymentResultDto {
  paymentId: number;
  bookingId: number;
  bookingNumber: string;
  amountPaid: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paidAtUtc: string;
  message: string;
}

export interface ProcessPaymentRequestDto {
  paymentMethod: PaymentMethod;
  cardholderName?: string;
  testCardNumber?: string;
  expiry?: string;
  testCvv?: string;
}

export type Payment = PaymentHistoryDto;
export type PaymentSummary = PaymentHistoryDto;

export interface CustomerDto {
  customerId?: number;
  id?: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  bookingCount?: number;
  bookingsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export type Customer = CustomerDto;
export type CustomerDetails = CustomerDto;
export type CustomerProfileDto = CustomerDto;

export * from './customer-summary.model';
export * from './update-customer-request.model';

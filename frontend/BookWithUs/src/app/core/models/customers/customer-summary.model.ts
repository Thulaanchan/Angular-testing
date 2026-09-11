export interface CustomerSummaryDto {
  customerId?: number;
  id?: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  bookingCount?: number;
  bookingsCount?: number;
  registeredDate?: string;
  totalBookings?: number;
  status?: string;
}

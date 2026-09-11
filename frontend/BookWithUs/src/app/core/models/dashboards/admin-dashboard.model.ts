export interface AdminDashboardSummaryDto {
  totalEvents: number;
  activeEvents?: number;
  totalBookings: number;
  availableSeats: number;
  occupiedParking: number;
  totalRevenue: number;
  totalCustomers: number;
  seatOccupancyRate?: number;
  parkingUtilizationRate?: number;
  upcomingEvents?: UpcomingEventDto[];
  recentBookings?: RecentBookingDto[];
}

export interface UpcomingEventDto {
  eventId: number;
  eventName: string;
  title?: string;
  venueName: string;
  eventDate: string;
  startTime: string;
  bookingCount: number;
  totalSeats: number;
  totalCapacity?: number;
  availableSeats: number;
  bookedSeats: number;
  soldSeats?: number;
  occupancyPercentage: number;
}

export interface RecentBookingDto {
  bookingId: number;
  bookingNumber: string;
  bookingReference?: string;
  customerName: string;
  eventName: string;
  eventTitle?: string;
  createdAt: string;
  bookingDate?: string;
  amount: number;
  totalAmount?: number;
  status: string;
}

export * from './customer-dashboard.model';


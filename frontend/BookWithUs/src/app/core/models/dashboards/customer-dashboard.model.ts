export interface CustomerDashboardSummaryDto {
  upcomingBookingsCount?: number;
  reservedParkingCount?: number;
  recentPaymentsCount?: number;
  unreadNotificationsCount?: number;
  totalBookings?: number;
  activePasses?: number;
  parkingReservations?: number;
  totalSpent?: number;
  upcomingEvents?: any[];
  recommendedEvents?: any[];
}

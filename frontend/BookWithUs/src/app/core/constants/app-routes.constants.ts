export const APP_ROUTES = {
  home: '',
  events: 'events',
  eventDetails: (id: string | number) => `events/${id}`,
  seats: (eventId: string | number) => `events/${eventId}/seats`,
  parking: (eventId: string | number) => `events/${eventId}/parking`,
  
  // Auth
  auth: {
    root: 'auth',
    login: 'auth/login',
    register: 'auth/register',
    forgotPassword: 'auth/forgot-password',
    verifyEmail: 'auth/verify-email',
    resetPassword: 'auth/reset-password'
  },

  // Checkout Flow
  checkout: {
    root: 'checkout',
    review: 'checkout/review',
    payment: 'checkout/payment',
    confirmation: 'checkout/confirmation'
  },

  // Customer Portal
  customer: {
    root: 'customer',
    dashboard: 'customer/dashboard',
    bookings: 'customer/bookings',
    bookingDetails: (id: string | number) => `customer/bookings/${id}`,
    notifications: 'customer/notifications',
    profile: 'customer/profile',
    payments: 'customer/payments'
  },

  // Admin Portal
  admin: {
    root: 'admin',
    dashboard: 'admin/dashboard',
    customers: 'admin/customers',
    venues: 'admin/venues',
    venueCreate: 'admin/venues/create',
    categories: 'admin/categories',
    categoryCreate: 'admin/categories/create',
    events: 'admin/events',
    eventCreate: 'admin/events/create',
    eventSeats: (id: string | number) => `admin/events/${id}/seats`,
    eventParking: (id: string | number) => `admin/events/${id}/parking`,
    bookings: 'admin/bookings',
    payments: 'admin/payments'
  }
};

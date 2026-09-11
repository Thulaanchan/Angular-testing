export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  },
  customers: {
    register: '/customers/register',
    byId: (id: number) => `/customers/${id}`,
    update: (id: number) => `/customers/${id}`,
    search: '/customers',
    deactivate: (id: number) => `/customers/${id}`
  },
  events: {
    base: '/events',
    byId: (id: number) => `/events/${id}`
  },
  bookings: {
    base: '/bookings',
    byId: (id: number) => `/bookings/${id}`,
    byCustomer: (customerId: number) => `/bookings/customer/${customerId}`,
    byEvent: (eventId: number) => `/bookings?eventId=${eventId}`,
    cancel: (id: number) => `/bookings/${id}`
  },
  payments: {
    bookingPayment: (bookingId: number) => `/bookings/${bookingId}/payment`,
    customerHistory: (customerId: number) => `/payments/customer/${customerId}`,
    receipt: (paymentId: number) => `/payments/${paymentId}/receipt`,
    all: '/payments'
  },
  seats: {
    byEvent: (eventId: number) => `/events/${eventId}/seats`,
    byId: (id: number) => `/seats/${id}`,
    hold: (bookingId: number) => `/bookings/${bookingId}/seats`,
    layoutCategories: (eventId: number) => `/events/${eventId}/seat-layout/categories`,
    layoutSections: (eventId: number) => `/events/${eventId}/seat-layout/sections`
  },
  parking: {
    byEvent: (eventId: number) => `/events/${eventId}/parking-slots`,
    byId: (id: number) => `/parking-slots/${id}`,
    zones: (eventId: number) => `/events/${eventId}/parking-zones`,
    reserve: (bookingId: number) => `/bookings/${bookingId}/parking`,
    remove: (bookingId: number) => `/bookings/${bookingId}/parking`
  },
  venues: {
    base: '/venues',
    byId: (id: number) => `/venues/${id}`,
    availability: (id: number) => `/venues/${id}/availability`
  },
  categories: {
    base: '/categories',
    byId: (id: number) => `/categories/${id}`
  },
  dashboards: {
    adminSummary: '/admin/dashboard/summary',
    adminUpcomingEvents: '/admin/dashboard/upcoming-events',
    adminRecentBookings: '/admin/dashboard/recent-bookings',
    customerSummary: '/customer/dashboard/summary'
  },
  notifications: {
    byCustomer: (customerId: number) => `/notifications/customer/${customerId}`,
    unreadCount: (customerId: number) => `/notifications/customer/${customerId}/unread-count`,
    markRead: (id: number) => `/notifications/${id}/read`
  }
};

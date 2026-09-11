import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { checkoutGuard } from './core/guards/checkout.guard';

export const routes: Routes = [
  // Public Events Flow
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full'
  },
  {
    path: 'events',
    loadComponent: () => import('./features/events/shell/events-shell.component').then(m => m.EventsShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/events/pages/event-list-page/event-list-page.component').then(m => m.EventListPageComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/events/pages/event-details-page/event-details-page.component').then(m => m.EventDetailsPageComponent)
      }
    ]
  },

  // Auth Pages
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/pages/forgot-password-page/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent)
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/pages/verify-email-sent-page/verify-email-sent-page.component').then(m => m.VerifyEmailSentPageComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/pages/reset-password-page/reset-password-page.component').then(m => m.ResetPasswordPageComponent)
      }
    ]
  },

  // Booking & Checkout Flow
  {
    path: 'booking',
    loadComponent: () => import('./features/checkout/shell/checkout-shell.component').then(m => m.CheckoutShellComponent),
    children: [
      { path: '', redirectTo: 'seats', pathMatch: 'full' },
      {
        path: 'seats',
        loadComponent: () => import('./features/seats/pages/seat-selection-page/seat-selection-page.component').then(m => m.SeatSelectionPageComponent)
      },
      {
        path: 'parking',
        loadComponent: () => import('./features/parking/pages/parking-selection-page/parking-selection-page.component').then(m => m.ParkingSelectionPageComponent)
      },
      {
        path: 'review',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./features/checkout/pages/booking-review-page/booking-review-page.component').then(m => m.BookingReviewPageComponent)
      },
      {
        path: 'payment',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./features/payments/pages/payment-checkout-page/payment-checkout-page.component').then(m => m.PaymentCheckoutPageComponent)
      },
      {
        path: 'confirmation',
        loadComponent: () => import('./features/bookings/pages/booking-confirmation-page/booking-confirmation-page.component').then(m => m.BookingConfirmationPageComponent)
      },
      {
        path: 'confirmation/:id',
        loadComponent: () => import('./features/bookings/pages/booking-confirmation-page/booking-confirmation-page.component').then(m => m.BookingConfirmationPageComponent)
      }
    ]
  },

  // Direct compatibility aliases (Section 52)
  { path: 'home', redirectTo: 'customer/dashboard', pathMatch: 'full' },
  {
    path: 'events/:id/seats',
    loadComponent: () => import('./features/seats/pages/seat-selection-page/seat-selection-page.component').then(m => m.SeatSelectionPageComponent)
  },
  {
    path: 'events/:id/parking',
    loadComponent: () => import('./features/parking/pages/parking-selection-page/parking-selection-page.component').then(m => m.ParkingSelectionPageComponent)
  },
  { path: 'checkout/review', redirectTo: 'booking/review', pathMatch: 'full' },
  { path: 'checkout/payment', redirectTo: 'booking/payment', pathMatch: 'full' },
  { path: 'checkout/confirmation', redirectTo: 'booking/confirmation', pathMatch: 'full' },
  { path: 'checkout/confirmation/:id', redirectTo: (route: any) => `/booking/confirmation/${route.params['id']}` },
  { path: 'bookings', redirectTo: 'customer/bookings', pathMatch: 'full' },
  { path: 'bookings/:id', redirectTo: (route: any) => `/customer/bookings/${route.params['id']}` },
  { path: 'bookings/:id/confirmation', redirectTo: (route: any) => `/booking/confirmation/${route.params['id']}` },
  { path: 'payments', redirectTo: 'customer/payments', pathMatch: 'full' },
  { path: 'payments/:id/receipt', redirectTo: (route: any) => `/receipt/${route.params['id']}` },
  { path: 'notifications', redirectTo: 'customer/notifications', pathMatch: 'full' },
  { path: 'profile', redirectTo: 'customer/profile', pathMatch: 'full' },

  // Customer Portal
  {
    path: 'customer',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bookings/shell/bookings-shell.component').then(m => m.BookingsShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/customer-dashboard/pages/customer-dashboard-page/customer-dashboard-page.component').then(m => m.CustomerDashboardPageComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/bookings/pages/my-bookings-page/my-bookings-page.component').then(m => m.MyBookingsPageComponent)
      },
      {
        path: 'bookings/:id',
        loadComponent: () => import('./features/bookings/pages/booking-details-page/booking-details-page.component').then(m => m.BookingDetailsPageComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/pages/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/payments/pages/payment-history-page/payment-history-page.component').then(m => m.PaymentHistoryPageComponent)
      }
    ]
  },

  // Admin Portal
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/shell/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/pages/admin-dashboard-page/admin-dashboard-page.component').then(m => m.AdminDashboardPageComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/admin/customers/pages/customer-management-page/customer-management-page.component').then(m => m.CustomerManagementPageComponent)
      },
      {
        path: 'venues',
        loadComponent: () => import('./features/admin/venues/pages/venue-management-page/venue-management-page.component').then(m => m.VenueManagementPageComponent)
      },
      {
        path: 'venues/create',
        loadComponent: () => import('./features/admin/venues/pages/venue-form-page/venue-form-page.component').then(m => m.VenueFormPageComponent)
      },
      {
        path: 'venues/new',
        redirectTo: 'venues/create',
        pathMatch: 'full'
      },
      {
        path: 'venues/:id/edit',
        loadComponent: () => import('./features/admin/venues/pages/venue-form-page/venue-form-page.component').then(m => m.VenueFormPageComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/admin/categories/pages/category-management-page/category-management-page.component').then(m => m.CategoryManagementPageComponent)
      },
      {
        path: 'categories/create',
        loadComponent: () => import('./features/admin/categories/pages/category-form-page/category-form-page.component').then(m => m.CategoryFormPageComponent)
      },
      {
        path: 'categories/new',
        redirectTo: 'categories/create',
        pathMatch: 'full'
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () => import('./features/admin/categories/pages/category-form-page/category-form-page.component').then(m => m.CategoryFormPageComponent)
      },
      {
        path: 'events',
        loadComponent: () => import('./features/admin/events/pages/event-management-page/event-management-page.component').then(m => m.EventManagementPageComponent)
      },
      {
        path: 'events/create',
        loadComponent: () => import('./features/admin/events/pages/event-form-page/event-form-page.component').then(m => m.EventFormPageComponent)
      },
      {
        path: 'events/new',
        redirectTo: 'events/create',
        pathMatch: 'full'
      },
      {
        path: 'events/:id/edit',
        loadComponent: () => import('./features/admin/events/pages/event-form-page/event-form-page.component').then(m => m.EventFormPageComponent)
      },
      {
        path: 'events/:id/seats',
        loadComponent: () => import('./features/admin/seat-layout/pages/admin-seat-map-page/admin-seat-map-page.component').then(m => m.AdminSeatMapPageComponent)
      },
      {
        path: 'events/:id/parking',
        loadComponent: () => import('./features/admin/parking-layout/pages/admin-parking-layout-page/admin-parking-layout-page.component').then(m => m.AdminParkingLayoutPageComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/admin/bookings/pages/booking-management-page/booking-management-page.component').then(m => m.BookingManagementPageComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/admin/payments/pages/payment-management-page/payment-management-page.component').then(m => m.PaymentManagementPageComponent)
      }
    ]
  },

  // Standalone Printable Receipt Page
  {
    path: 'receipt/:id',
    loadComponent: () => import('./features/payments/pages/receipt-page/receipt-page.component').then(m => m.ReceiptPageComponent)
  },

  // 404 Wildcard
  {
    path: '**',
    loadComponent: () => import('./features/errors/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent)
  }
];

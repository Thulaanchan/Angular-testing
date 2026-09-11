import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingStateService } from '../services/bookings/booking-state.service';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const bookingStateService = inject(BookingStateService);
  const router = inject(Router);

  if (bookingStateService.hasActiveSelection()) {
    return true;
  }

  return router.createUrlTree(['/events']);
};

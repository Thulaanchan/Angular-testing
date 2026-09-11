import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function expiryInFutureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const parts = control.value.trim().split('/');
    if (parts.length !== 2) return null;

    const month = parseInt(parts[0], 10);
    const year = parseInt('20' + parts[1], 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { cardExpired: true };
    }
    return null;
  };
}

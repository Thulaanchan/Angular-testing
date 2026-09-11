import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cardChecksumValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const clean = String(control.value).replace(/[\s-]/g, '');
    if (!/^\d{16}$/.test(clean)) {
      return { invalidCardNumber: true };
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    if (sum % 10 !== 0) {
      return { invalidChecksum: true };
    }

    return null;
  };
}

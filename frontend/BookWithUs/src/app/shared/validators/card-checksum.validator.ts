import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cardChecksumValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const clean = control.value.replace(/[\s-]/g, '');
    if (!/^\d{13,19}$/.test(clean)) {
      return { invalidCardNumber: true };
    }
    return null;
  };
}

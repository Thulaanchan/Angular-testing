import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function expiryFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(control.value.trim())) {
      return { invalidExpiryFormat: true };
    }
    return null;
  };
}

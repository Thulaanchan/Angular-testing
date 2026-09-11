import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function venueCapacityValidator(venueCapacityGetter: () => number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const capacity = Number(control.value);
    const maxCapacity = venueCapacityGetter();

    if (maxCapacity > 0 && capacity > maxCapacity) {
      return { exceedsVenueCapacity: { max: maxCapacity, actual: capacity } };
    }
    return null;
  };
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function timeRangeValidator(startTimeKey = 'startTime', endTimeKey = 'endTime'): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startTimeKey)?.value;
    const end = group.get(endTimeKey)?.value;

    if (start && end && start >= end) {
      return { invalidTimeRange: true };
    }
    return null;
  };
}

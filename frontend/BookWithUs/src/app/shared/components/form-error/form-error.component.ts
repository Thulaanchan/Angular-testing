import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.css']
})
export class FormErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() customMessage?: string;
  @Input() fieldName: string = 'Field';

  get errorMessage(): string | null {
    if (this.customMessage) return this.customMessage;
    if (!this.control || !this.control.touched || !this.control.errors) return null;

    const errors = this.control.errors;
    if (errors['required']) return `${this.fieldName} is required`;
    if (errors['email']) return `Please enter a valid email address`;
    if (errors['minlength']) return `${this.fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['min']) return `${this.fieldName} must be at least ${errors['min'].min}`;
    if (errors['max']) return `${this.fieldName} cannot exceed ${errors['max'].max}`;
    if (errors['passwordMismatch']) return 'Passwords do not match';
    if (errors['invalidCard']) return 'Invalid credit card number';
    if (errors['invalidExpiry']) return 'Invalid expiration date (MM/YY)';
    if (errors['expiryInPast']) return 'Card has expired';
    if (errors['pastDate']) return 'Date must be in the future';
    if (errors['invalidTimeRange']) return 'End time must be after start time';
    if (errors['capacityExceeded']) return errors['capacityExceeded'].message || 'Capacity exceeded';

    return 'Invalid field value';
  }
}

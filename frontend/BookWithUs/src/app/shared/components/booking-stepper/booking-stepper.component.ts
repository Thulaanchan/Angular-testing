import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepItem {
  id: number;
  label: string;
}

@Component({
  selector: 'app-booking-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-stepper.component.html',
  styleUrls: ['./booking-stepper.component.css']
})
export class BookingStepperComponent {
  @Input() currentStep = 1;

  steps: StepItem[] = [
    { id: 1, label: 'Seats' },
    { id: 2, label: 'Parking' },
    { id: 3, label: 'Review' },
    { id: 4, label: 'Payment' }
  ];
}

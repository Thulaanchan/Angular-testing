import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatAvailabilityDto } from '../../../../core/models/seats/seat.model';
import { SeatStatusDirective } from '../../../../shared/directives/seat-status.directive';
import { SeatLabelPipe } from '../../../../shared/pipes/seat-label.pipe';

@Component({
  selector: 'app-seat-item',
  standalone: true,
  imports: [CommonModule, SeatStatusDirective, SeatLabelPipe],
  templateUrl: './seat-item.component.html',
  styleUrls: ['./seat-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatItemComponent {
  @Input({ required: true }) seat!: SeatAvailabilityDto;
  @Input() isSelected = false;

  @Output() seatClick = new EventEmitter<SeatAvailabilityDto>();
  @Output() seatHover = new EventEmitter<SeatAvailabilityDto | null>();

  onSelect(): void {
    if (this.seat.status === 'Available') {
      this.seatClick.emit(this.seat);
    }
  }

  onHover(): void {
    this.seatHover.emit(this.seat);
  }

  onLeave(): void {
    this.seatHover.emit(null);
  }
}
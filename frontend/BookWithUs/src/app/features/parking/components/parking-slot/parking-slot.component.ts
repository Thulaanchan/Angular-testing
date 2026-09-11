import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingAvailabilityDto } from '../../../../core/models/parking/parking-slot.model';
import { SlotCodePipe } from '../../../../shared/pipes/slot-code.pipe';

@Component({
  selector: 'app-parking-slot',
  standalone: true,
  imports: [CommonModule, SlotCodePipe],
  templateUrl: './parking-slot.component.html',
  styleUrls: ['./parking-slot.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParkingSlotComponent {
  @Input({ required: true }) slot!: ParkingAvailabilityDto;
  @Input() isSelected = false;

  @Output() slotClick = new EventEmitter<ParkingAvailabilityDto>();
  @Output() slotHover = new EventEmitter<ParkingAvailabilityDto | null>();

  onSelect(): void {
    if (this.slot.status === 'Available') {
      this.slotClick.emit(this.slot);
    }
  }

  onHover(): void {
    this.slotHover.emit(this.slot);
  }

  onLeave(): void {
    this.slotHover.emit(null);
  }
}

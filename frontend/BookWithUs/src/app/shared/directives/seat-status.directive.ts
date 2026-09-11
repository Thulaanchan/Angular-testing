import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { SeatStatus } from '../../core/models/seats/seat-status.model';

@Directive({
  selector: '[appSeatStatus]',
  standalone: true
})
export class SeatStatusDirective implements OnChanges {
  @Input('appSeatStatus') status: SeatStatus | number | string | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    this.applyStatusClass();
  }

  private applyStatusClass() {
    const el = this.el.nativeElement;
    // Remove previous classes
    this.renderer.removeClass(el, 'seat-available');
    this.renderer.removeClass(el, 'seat-booked');
    this.renderer.removeClass(el, 'seat-held');
    this.renderer.removeClass(el, 'seat-vip');

    switch (this.status) {
      case SeatStatus.Available:
      case 1:
        this.renderer.addClass(el, 'seat-available');
        break;
      case SeatStatus.Held:
      case 2:
        this.renderer.addClass(el, 'seat-held');
        break;
      case SeatStatus.Booked:
      case 3:
        this.renderer.addClass(el, 'seat-booked');
        break;
      case 4:
      case 'VIP':
        this.renderer.addClass(el, 'seat-vip');
        break;
    }
  }
}

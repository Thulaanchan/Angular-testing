import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-banner.component.html',
  styleUrls: ['./alert-banner.component.css']
})
export class AlertBannerComponent {
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() title?: string;
  @Input() message: string = '';
  @Input() dismissible: boolean = false;

  @Output() dismissed = new EventEmitter<void>();

  visible: boolean = true;

  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }
}

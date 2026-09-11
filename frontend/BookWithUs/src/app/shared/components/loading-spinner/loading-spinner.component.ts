import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() overlay: boolean = false;
  @Input() color: string = 'text-purple-600';

  get sizeClasses(): string {
    switch (this.size) {
      case 'sm': return 'w-5 h-5';
      case 'lg': return 'w-12 h-12';
      default: return 'w-8 h-8';
    }
  }
}

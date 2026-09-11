import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number | null | undefined = '0';
  @Input() subtitle?: string;
  @Input() icon: string = 'chart'; // 'ticket' | 'calendar' | 'car' | 'dollar' | 'users' | 'chart' | 'check'
  @Input() iconBg: string = 'bg-purple-100 text-purple-600';
  @Input() change?: string;
  @Input() changeType?: 'positive' | 'negative' | 'neutral' = 'neutral';
  @Input() trend?: { value: number; isPositive: boolean; label?: string };
}

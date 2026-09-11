import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() status: any = '';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';
  @Input() showDot: boolean = true;

  get badgeClasses(): string {
    const s = (this.status != null ? String(this.status) : '').toLowerCase().trim();
    const base = 'inline-flex items-center font-medium rounded-full transition-colors';

    const sizeClasses = {
      xs: 'px-2 py-0.5 text-xs',
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-3.5 py-1.5 text-base'
    }[this.size] || 'px-2.5 py-0.5 text-xs';

    let colorClasses = 'bg-slate-100 text-slate-700 border border-slate-200';

    if (s === 'confirmed' || s === 'active' || s === 'completed' || s === 'available' || s === 'success' || s === 'paid') {
      colorClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
    } else if (s === 'pending' || s === 'held' || s === 'reserved' || s === 'in_progress' || s === 'warning') {
      colorClasses = 'bg-amber-50 text-amber-700 border border-amber-200/60';
    } else if (s === 'cancelled' || s === 'inactive' || s === 'failed' || s === 'danger' || s === 'rejected' || s === 'occupied') {
      colorClasses = 'bg-rose-50 text-rose-700 border border-rose-200/60';
    } else if (s === 'vip' || s === 'platinum' || s === 'premium') {
      colorClasses = 'bg-purple-50 text-purple-700 border border-purple-200/60';
    } else if (s === 'gold') {
      colorClasses = 'bg-yellow-50 text-yellow-800 border border-yellow-200/60';
    } else if (s === 'silver') {
      colorClasses = 'bg-slate-100 text-slate-700 border border-slate-300';
    }

    return `${base} ${sizeClasses} ${colorClasses}`;
  }

  get dotClasses(): string {
    const s = (this.status != null ? String(this.status) : '').toLowerCase().trim();
    if (s === 'confirmed' || s === 'active' || s === 'completed' || s === 'available' || s === 'success' || s === 'paid') {
      return 'bg-emerald-500';
    } else if (s === 'pending' || s === 'held' || s === 'reserved' || s === 'in_progress' || s === 'warning') {
      return 'bg-amber-500';
    } else if (s === 'cancelled' || s === 'inactive' || s === 'failed' || s === 'danger' || s === 'rejected' || s === 'occupied') {
      return 'bg-rose-500';
    } else if (s === 'vip' || s === 'platinum' || s === 'premium') {
      return 'bg-purple-500';
    } else if (s === 'gold') {
      return 'bg-yellow-500';
    }
    return 'bg-slate-400';
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  @Input() title: string = 'No results found';
  @Input() description: string = 'We could not find any records matching your criteria.';
  @Input() icon: string = 'inbox'; // 'inbox' | 'search' | 'calendar' | 'ticket'
  @Input() actionLabel?: string;
  @Input() actionRoute?: string | any[];
  @Output() actionClicked = new EventEmitter<void>();
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { HoldCountdownComponent } from '../../../shared/components/hold-countdown/hold-countdown.component';

@Component({
  selector: 'app-checkout-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, HoldCountdownComponent],
  templateUrl: './checkout-shell.component.html',
  styleUrls: ['./checkout-shell.component.css']
})
export class CheckoutShellComponent {}

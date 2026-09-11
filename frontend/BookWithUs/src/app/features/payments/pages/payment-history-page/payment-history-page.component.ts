import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PaymentService } from '../../../../core/services/payments/payment.service';
import { PaymentHistoryDto } from '../../../../core/models/payments/payment-history.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-payment-history-page',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './payment-history-page.component.html',
  styleUrls: ['./payment-history-page.component.css']
})
export class PaymentHistoryPageComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  payments: PaymentHistoryDto[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadPaymentHistory();
  }

  loadPaymentHistory(): void {
    this.isLoading = true;
    this.paymentService.getCustomerPayments().subscribe({
      next: (data: PaymentHistoryDto[]) => {
        this.payments = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  viewReceipt(payment: PaymentHistoryDto): void {
    this.router.navigate(['/receipt', payment.bookingId]);
  }
}

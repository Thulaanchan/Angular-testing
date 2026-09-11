import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PaymentService } from '../../../../core/services/payments/payment.service';
import { PaymentHistoryDto } from '../../../../core/models/payments/payment-history.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-payment-history-page',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './payment-history-page.component.html',
  styleUrls: ['./payment-history-page.component.css']
})
export class PaymentHistoryPageComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  payments: PaymentHistoryDto[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadPaymentHistory();
  }

  loadPaymentHistory(): void {
    this.isLoading = true;
    const customerId = this.authService.getCustomerId() || 1;
    this.paymentService.getCustomerPayments(customerId).subscribe({
      next: (data: PaymentHistoryDto[]) => {
        this.payments = data || [];
        this.isLoading = false;
      },
      error: () => {
        this.payments = [];
        this.isLoading = false;
      }
    });
  }

  getPaymentMethodName(method: any): string {
    if (method === 1 || method === '1' || method === 'Card') return 'Credit / Debit Card';
    if (method === 2 || method === '2' || method === 'MobileWallet') return 'Mobile Wallet';
    if (method === 3 || method === '3' || method === 'NetBanking') return 'Net Banking';
    if (method === 4 || method === '4' || method === 'LankaQr') return 'LankaQR';
    return String(method || 'Card');
  }

  getPaymentStatusName(status: any): string {
    if (status === 0 || status === '0' || status === 'Pending') return 'Pending';
    if (status === 1 || status === '1' || status === 'Completed') return 'Completed';
    if (status === 2 || status === '2' || status === 'Failed') return 'Failed';
    return String(status || 'Completed');
  }

  viewReceipt(payment: PaymentHistoryDto): void {
    this.router.navigate(['/receipt', payment.paymentId]);
  }
}

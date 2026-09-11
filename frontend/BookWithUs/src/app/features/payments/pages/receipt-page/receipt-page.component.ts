import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentService } from '../../../../core/services/payments/payment.service';
import { PaymentReceiptDto } from '../../../../core/models/payments/payment-receipt.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-receipt-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, AlertBannerComponent],
  templateUrl: './receipt-page.component.html',
  styleUrls: ['./receipt-page.component.css']
})
export class ReceiptPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);

  receipt: PaymentReceiptDto | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const paramId = Number(this.route.snapshot.paramMap.get('id') || '0');
    if (paramId > 0) {
      this.loadReceipt(paramId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'A valid payment or booking reference ID is required.';
    }
  }

  loadReceipt(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    // First try loading receipt directly with id as paymentId
    this.paymentService.getReceipt(id).subscribe({
      next: (data) => {
        this.receipt = data;
        this.isLoading = false;
      },
      error: () => {
        // If not found, id might be bookingId - find in customer payment history
        this.paymentService.getCustomerPayments().subscribe({
          next: (payments) => {
            const match = (payments || []).find(p => p.bookingId === id || p.paymentId === id);
            if (match) {
              this.paymentService.getReceipt(match.paymentId).subscribe({
                next: (receiptData) => {
                  this.receipt = receiptData;
                  this.isLoading = false;
                },
                error: (err) => {
                  this.isLoading = false;
                  this.errorMessage = err.error?.message || 'Payment receipt was not found.';
                }
              });
            } else {
              this.isLoading = false;
              this.errorMessage = 'No completed payment receipt found for this reference.';
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Payment receipt was not found.';
          }
        });
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

  print(): void {
    window.print();
  }
}

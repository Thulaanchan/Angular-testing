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
    const bookingId = Number(this.route.snapshot.paramMap.get('id') || '1');
    this.loadReceipt(bookingId);
  }

  loadReceipt(bookingId: number): void {
    this.isLoading = true;
    this.paymentService.getReceipt(bookingId).subscribe({
      next: (data) => {
        this.receipt = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Could not load receipt.';
      }
    });
  }

  print(): void {
    window.print();
  }
}

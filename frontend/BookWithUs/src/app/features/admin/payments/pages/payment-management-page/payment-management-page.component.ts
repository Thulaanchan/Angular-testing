import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../../../core/services/payments/payment.service';
import { PaymentHistoryDto } from '../../../../../core/models/payments/payment-history.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-payment-management-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ModalComponent,
    AlertBannerComponent
  ],
  templateUrl: './payment-management-page.component.html',
  styleUrls: ['./payment-management-page.component.css']
})
export class PaymentManagementPageComponent implements OnInit {
  private paymentService = inject(PaymentService);

  payments: PaymentHistoryDto[] = [];
  filteredPayments: PaymentHistoryDto[] = [];
  isLoading = true;

  searchTerm = '';
  statusFilter = 'all';

  selectedPayment: PaymentHistoryDto | null = null;
  showDetailsModal = false;

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getCustomerPayments().subscribe({
      next: (data: PaymentHistoryDto[]) => {
        this.payments = data;
        this.filter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filter(): void {
    let list = [...this.payments];
    if (this.statusFilter !== 'all') {
      list = list.filter(p => (p.paymentStatus != null ? String(p.paymentStatus) : '').toLowerCase() === this.statusFilter.toLowerCase());
    }
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(p =>
        (p.bookingNumber && p.bookingNumber.toLowerCase().includes(q)) ||
        (p.eventName && p.eventName.toLowerCase().includes(q)) ||
        (p.customerName && p.customerName.toLowerCase().includes(q))
      );
    }
    this.filteredPayments = list;
  }

  viewDetails(p: PaymentHistoryDto): void {
    this.selectedPayment = p;
    this.showDetailsModal = true;
  }
}

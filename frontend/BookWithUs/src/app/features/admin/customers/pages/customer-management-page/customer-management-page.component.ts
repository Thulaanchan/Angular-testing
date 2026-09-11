import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../../../core/services/customers/customer.service';
import { CustomerSummaryDto, CustomerProfileDto } from '../../../../../core/models/customers/customer.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-customer-management-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent,
    ModalComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './customer-management-page.component.html',
  styleUrls: ['./customer-management-page.component.css']
})
export class CustomerManagementPageComponent implements OnInit {
  private customerService = inject(CustomerService);

  customers: CustomerSummaryDto[] = [];
  filteredCustomers: CustomerSummaryDto[] = [];
  isLoading = true;

  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  // Drawer / Details Modal
  selectedCustomer: CustomerSummaryDto | null = null;
  showDetailsModal = false;

  // Deactivate dialog
  showDeactivateDialog = false;
  isDeactivating = false;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers({
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      status: this.statusFilter !== 'all' ? this.statusFilter : undefined
    }).subscribe({
      next: (res: any) => {
        this.customers = res.items;
        this.filteredCustomers = res.items;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCustomers();
  }

  onFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.loadCustomers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCustomers();
  }

  viewCustomerDetails(customer: CustomerSummaryDto): void {
    this.selectedCustomer = customer;
    this.showDetailsModal = true;
  }

  openDeactivateDialog(customer: CustomerSummaryDto, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedCustomer = customer;
    this.showDeactivateDialog = true;
  }

  confirmDeactivate(): void {
    if (!this.selectedCustomer) return;
    this.isDeactivating = true;
    const customerId = this.selectedCustomer.customerId || this.selectedCustomer.id || 0;

    this.customerService.deactivateCustomer(customerId).subscribe({
      next: () => {
        this.isDeactivating = false;
        this.showDeactivateDialog = false;
        if (this.selectedCustomer) {
          this.selectedCustomer.status = 'Inactive';
        }
        this.loadCustomers();
      },
      error: () => {
        this.isDeactivating = false;
      }
    });
  }
}

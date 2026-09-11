import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../../../core/services/customers/customer.service';
import { CustomerSummaryDto, CustomerDto } from '../../../../../core/models/customers/customer.model';
import { PagedResult } from '../../../../../core/models/common/paged-result.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

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
    ConfirmationDialogComponent,
    AlertBannerComponent
  ],
  templateUrl: './customer-management-page.component.html',
  styleUrls: ['./customer-management-page.component.css']
})
export class CustomerManagementPageComponent implements OnInit {
  private customerService = inject(CustomerService);

  customers: CustomerSummaryDto[] = [];
  isLoading = true;
  errorMessage = '';

  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  // Drawer / Details Modal
  selectedCustomer: CustomerSummaryDto | null = null;
  selectedCustomerDetails: CustomerDto | null = null;
  isLoadingDetails = false;
  showDetailsModal = false;

  // Deactivate dialog
  showDeactivateDialog = false;
  isDeactivating = false;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.customerService.searchCustomers(
      this.searchTerm.trim() || undefined,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (res: PagedResult<CustomerSummaryDto>) => {
        let items = res.items || [];
        if (this.statusFilter === 'active') {
          items = items.filter(c => c.isActive);
        } else if (this.statusFilter === 'inactive') {
          items = items.filter(c => !c.isActive);
        }
        this.customers = items;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.customers = [];
        this.errorMessage = 'Unable to load customer directory. Please check your connection and try again.';
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
    this.selectedCustomerDetails = null;
    this.showDetailsModal = true;
    this.isLoadingDetails = true;

    const id = customer.customerId || customer.id || 0;
    if (id > 0) {
      this.customerService.getCustomerById(id).subscribe({
        next: (details) => {
          this.selectedCustomerDetails = details;
          this.isLoadingDetails = false;
        },
        error: () => {
          this.isLoadingDetails = false;
        }
      });
    } else {
      this.isLoadingDetails = false;
    }
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
          this.selectedCustomer.isActive = false;
        }
        this.loadCustomers();
      },
      error: () => {
        this.isDeactivating = false;
      }
    });
  }
}

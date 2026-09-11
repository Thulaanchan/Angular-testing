import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboards/dashboard.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CustomerDashboardSummaryDto } from '../../../../core/models/dashboards/dashboard-summary.model';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-customer-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, LoadingSpinnerComponent, StatusBadgeComponent],
  templateUrl: './customer-dashboard-page.component.html',
  styleUrls: ['./customer-dashboard-page.component.css']
})
export class CustomerDashboardPageComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  authService = inject(AuthService);

  summary: CustomerDashboardSummaryDto | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.dashboardService.getCustomerSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

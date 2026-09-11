import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../../core/services/categories/category.service';
import { CategoryDto } from '../../../../../core/models/categories/category.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-category-management-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent, ModalComponent, AlertBannerComponent],
  templateUrl: './category-management-page.component.html',
  styleUrls: ['./category-management-page.component.css']
})
export class CategoryManagementPageComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories: CategoryDto[] = [];
  isLoading = true;
  searchTerm = '';
  errorMessage = '';
  successMessage = '';

  selectedCategory: CategoryDto | null = null;
  showDetailsModal = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to load categories.';
      }
    });
  }

  get filteredCategories(): CategoryDto[] {
    if (!this.searchTerm.trim()) return this.categories;
    const q = this.searchTerm.toLowerCase();
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }

  viewDetails(cat: CategoryDto): void {
    this.selectedCategory = cat;
    this.showDetailsModal = true;
  }

  deleteCategory(cat: CategoryDto): void {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    this.categoryService.deleteCategory(cat.id).subscribe({
      next: () => {
        this.successMessage = `Category "${cat.name}" deleted successfully.`;
        this.loadCategories();
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = `Cannot delete category "${cat.name}" because it has linked events.`;
        } else {
          this.errorMessage = err.error?.message || err.message || `Failed to delete category "${cat.name}".`;
        }
      }
    });
  }
}

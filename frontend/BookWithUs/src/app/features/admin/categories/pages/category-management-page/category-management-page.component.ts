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

@Component({
  selector: 'app-category-management-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './category-management-page.component.html',
  styleUrls: ['./category-management-page.component.css']
})
export class CategoryManagementPageComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories: CategoryDto[] = [];
  isLoading = true;
  searchTerm = '';

  selectedCategory: CategoryDto | null = null;
  showDetailsModal = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
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
}

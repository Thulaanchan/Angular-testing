import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../../core/services/categories/category.service';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-category-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AlertBannerComponent],
  templateUrl: './category-form-page.component.html',
  styleUrls: ['./category-form-page.component.css']
})
export class CategoryFormPageComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  categoryId: number | null = null;
  isLoading = false;
  errorMessage = '';

  category = {
    name: '',
    description: '',
    isActive: true
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = Number(id);
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: number): void {
    this.isLoading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (cat) => {
        this.category.name = cat.name;
        this.category.description = cat.description || '';
        this.category.isActive = cat.isActive ?? true;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to load category.';
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const payload = {
      name: this.category.name.trim()
    };

    const op = this.isEditMode && this.categoryId
      ? this.categoryService.updateCategory(this.categoryId, payload)
      : this.categoryService.createCategory(payload);

    op.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to save category.';
      }
    });
  }
}

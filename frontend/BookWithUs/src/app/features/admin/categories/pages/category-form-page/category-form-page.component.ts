import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../../core/services/categories/category.service';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-category-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormErrorComponent, AlertBannerComponent],
  templateUrl: './category-form-page.component.html',
  styleUrls: ['./category-form-page.component.css']
})
export class CategoryFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  categoryId: number | null = null;
  isLoading = false;
  errorMessage = '';

  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = Number(id);
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (cat) => {
        this.categoryForm.patchValue({
          name: cat.name,
          description: cat.description,
          isActive: cat.isActive
        });
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formVal = this.categoryForm.value;

    const op = this.isEditMode && this.categoryId
      ? this.categoryService.updateCategory(this.categoryId, formVal)
      : this.categoryService.createCategory(formVal);

    op.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to save category.';
      }
    });
  }
}

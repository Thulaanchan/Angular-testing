import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormErrorComponent, AlertBannerComponent],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css']
})
export class ResetPasswordPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  token = '';

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: passwordMatchValidator('password', 'confirmPassword')
  });

  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || 'user@example.com';
    this.token = this.route.snapshot.queryParams['token'] || 'demo-reset-token';
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newPassword = this.resetForm.value.password;
    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      newPassword
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Password reset failed. Token may be expired.';
      }
    });
  }
}

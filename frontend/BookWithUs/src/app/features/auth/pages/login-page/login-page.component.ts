import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormErrorComponent, AlertBannerComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['leo.thas@email.com', [Validators.required, Validators.email]],
    password: ['Password123!', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;
    this.authService.login({ email: email.trim(), password, rememberMe: !!rememberMe }).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else if (this.authService.isAdmin() || user.role === 'Administrator' || user.role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/customer/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.status === 403) {
          this.errorMessage = 'Your account has been deactivated or requires verification.';
        } else if (err.status === 0) {
          this.errorMessage = 'Unable to connect to the authentication server. Please check your connection.';
        } else {
          this.errorMessage = 'An unexpected error occurred during sign in. Please try again.';
        }
      }
    });
  }

  loginAsDemo(role: 'Customer' | 'Admin'): void {
    if (role === 'Admin') {
      this.loginForm.patchValue({
        email: 'admin@bookwithus.com',
        password: 'Admin123!',
        rememberMe: false
      });
    } else {
      this.loginForm.patchValue({
        email: 'leo.thas@email.com',
        password: 'Password123!',
        rememberMe: false
      });
    }
    this.onSubmit();
  }
}

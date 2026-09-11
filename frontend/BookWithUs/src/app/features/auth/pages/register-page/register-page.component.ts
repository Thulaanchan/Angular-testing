import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormErrorComponent, AlertBannerComponent],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    phone: ['', [Validators.pattern(/^[0-9+() -]{7,25}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    agreeTerms: [false, [Validators.requiredTrue]]
  }, {
    validators: passwordMatchValidator('password', 'confirmPassword')
  });

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { firstName, lastName, email, phone, password, confirmPassword } = this.registerForm.value;
    this.authService.register({
      firstName,
      lastName,
      email,
      phone: phone?.trim() || null,
      password,
      confirmPassword
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/verify-email'], { queryParams: { email } });
      },
      error: (err) => {
        this.handleRegistrationError(err);
      }
    });
  }

  private handleRegistrationError(err: any): void {
    this.isLoading = false;

    // 1. Map ASP.NET Core ModelState validation errors (400)
    const validationErrors = err?.error?.errors || err?.errors;
    if (validationErrors && typeof validationErrors === 'object') {
      let unmappedErrors: string[] = [];
      const fieldMap: { [key: string]: string } = {
        firstname: 'firstName',
        lastname: 'lastName',
        email: 'email',
        phone: 'phone',
        phonenumber: 'phone',
        password: 'password',
        confirmpassword: 'confirmPassword',
        agreeterms: 'agreeTerms'
      };

      for (const [key, messages] of Object.entries(validationErrors)) {
        const lowerKey = key.toLowerCase();
        const formControlName = fieldMap[lowerKey];
        const errorMsg = Array.isArray(messages) ? messages[0] : String(messages);

        if (formControlName && this.registerForm.get(formControlName)) {
          const control = this.registerForm.get(formControlName)!;
          control.setErrors({ serverError: errorMsg });
          control.markAsTouched();
        } else {
          unmappedErrors.push(errorMsg);
        }
      }

      if (unmappedErrors.length > 0) {
        this.errorMessage = unmappedErrors.join(' ');
      } else {
        this.errorMessage = 'Please correct the highlighted errors below.';
      }
      return;
    }

    // 2. Handle Conflict (409) or explicit backend message
    if (err?.status === 409 || err?.error?.message) {
      const msg = err?.error?.message || 'An account with this email address already exists.';
      this.errorMessage = msg;
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('account')) {
        const emailControl = this.registerForm.get('email');
        if (emailControl) {
          emailControl.setErrors({ serverError: msg });
          emailControl.markAsTouched();
        }
      }
      return;
    }

    // 3. Fallback to clean human-readable error (never raw HttpErrorResponse)
    if (typeof err?.error === 'string' && err.error.length > 0 && !err.error.startsWith('<') && !err.error.startsWith('{')) {
      this.errorMessage = err.error;
    } else if (err?.message && !err.message.includes('Http failure') && !err.message.includes('localhost:')) {
      this.errorMessage = err.message;
    } else {
      this.errorMessage = 'Unable to complete registration. Please check your information and try again.';
    }
  }
}

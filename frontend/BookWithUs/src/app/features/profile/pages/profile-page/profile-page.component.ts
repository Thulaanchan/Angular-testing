import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CustomerService } from '../../../../core/services/customers/customer.service';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, AlertBannerComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private customerService = inject(CustomerService);

  profileForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }],
    phoneNumber: ['', [Validators.required]]
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmNewPassword: ['', [Validators.required]]
  });

  isSavingProfile = false;
  profileSuccess = false;
  isSavingPassword = false;
  passwordSuccess = false;
  passwordError = '';

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.profileForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || '+1 (555) 234-5678'
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSavingProfile = true;
    this.profileSuccess = false;

    const { fullName, phoneNumber } = this.profileForm.getRawValue();
    this.customerService.updateProfile({ fullName, phoneNumber }).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.profileSuccess = true;
        setTimeout(() => this.profileSuccess = false, 3000);
      },
      error: () => {
        this.isSavingProfile = false;
      }
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmNewPassword) {
      this.passwordError = 'New passwords do not match';
      return;
    }

    this.isSavingPassword = true;
    this.passwordError = '';
    this.passwordSuccess = false;

    setTimeout(() => {
      this.isSavingPassword = false;
      this.passwordSuccess = true;
      this.passwordForm.reset();
      setTimeout(() => this.passwordSuccess = false, 3000);
    }, 800);
  }
}

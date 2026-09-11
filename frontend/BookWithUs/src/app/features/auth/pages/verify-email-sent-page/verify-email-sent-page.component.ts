import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-verify-email-sent-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-email-sent-page.component.html',
  styleUrls: ['./verify-email-sent-page.component.css']
})
export class VerifyEmailSentPageComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  email: string = 'user@example.com';
  isResending = false;
  resendSuccess = false;

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || 'your email';
  }

  resendEmail(): void {
    this.isResending = true;
    setTimeout(() => {
      this.isResending = false;
      this.resendSuccess = true;
    }, 1200);
  }
}

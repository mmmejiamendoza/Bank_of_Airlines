import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  isLoading = false;

  onRegister(): void {
    this.errorMessage = '';

    // Check each required field individually
    if (!this.firstName.trim()) {
      this.errorMessage = 'First name is required.';
      return;
    }

    if (!this.lastName.trim()) {
      this.errorMessage = 'Last name is required.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Email is required.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Password is required.';
      return;
    }

    if (!this.confirmPassword) {
      this.errorMessage = 'Please confirm your password.';
      return;
    }

    // Names can only contain letters
    if (!this.isValidName(this.firstName.trim())) {
      this.errorMessage = 'First name can only contain letters.';
      return;
    }

    if (!this.isValidName(this.lastName.trim())) {
      this.errorMessage = 'Last name can only contain letters.';
      return;
    }

    // Email validation
    if (!this.isValidEmail(this.email.trim())) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Password requirements
    if (this.password.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters.';
      return;
    }

    if (!/[A-Z]/.test(this.password)) {
      this.errorMessage =
        'Password must contain at least one uppercase letter.';
      return;
    }

    if (!/[a-z]/.test(this.password)) {
      this.errorMessage =
        'Password must contain at least one lowercase letter.';
      return;
    }

    if (!/[^A-Za-z0-9]/.test(this.password)) {
      this.errorMessage =
        'Password must contain at least one special character.';
      return;
    }

    // Confirm password
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const response = this.authService.register({
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim(),
        email: this.email.trim(),
        password: this.password,
      });

      if (!response.success) {
        this.isLoading = false;
        this.errorMessage =
          response.error?.message ?? 'Unable to create your account.';
        this.cdr.detectChanges();
        return;
      }

      this.isLoading = false;

      // Registration succeeds → return to Login
      this.router.navigate(['/login']);
    }, 700);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private isValidName(name: string): boolean {
    return /^[A-Za-z]+$/.test(name);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

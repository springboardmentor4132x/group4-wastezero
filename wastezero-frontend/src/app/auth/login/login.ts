import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.isLoggedIn()) {
      this.redirectByRole(this.authService.getRole() || '');
    }
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log("🚀 Attempting industrial authentication for:", this.loginForm.value.email);

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          console.log("✅ Server Response:", res);
          this.isLoading = false;

          if (res && res.success === true) {
            // Securely store registry identity
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.role);
            localStorage.setItem('name', res.name);
            localStorage.setItem('userId', res.userId);

            console.log("🗺️ Identity established. Redirecting to role-based dashboard...");
            this.redirectByRole(res.role);
          } else {
            console.warn("⚠️ Authentication fault:", res.message);
            this.errorMessage = res.message || 'Invalid credentials or system fault.';
          }
        },
        error: (err) => {
          console.error("🔥 Network/Server Error:", err);
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Login failed. Check backend infrastructure connectivity.';
        }
      });
  }

  private redirectByRole(role: string): void {
    if (role === 'user') this.router.navigate(['/dashboard-user']);
    else if (role === 'volunteer') this.router.navigate(['/dashboard-volunteer']);
    else if (role === 'admin') this.router.navigate(['/dashboard-admin']);
    else this.router.navigate(['/login']);
  }
}
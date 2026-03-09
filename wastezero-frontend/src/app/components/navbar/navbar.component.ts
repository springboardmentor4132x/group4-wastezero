import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="navbar">
      <div class="logo">
        <h1 style="color: var(--primary-dark); font-size: 1.5rem;">WasteZero</h1>
      </div>
      <div class="actions" *ngIf="authService.isLoggedIn()">
        <span class="user-greeting">Hello, {{ authService.currentUser()?.name }}</span>
        <button class="btn btn-sm" (click)="authService.logout()">Logout</button>
      </div>
    </header>
  `,
    styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
    }
    .user-greeting {
      margin-right: 15px;
      font-weight: 500;
    }
    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
      width: auto;
    }
  `]
})
export class NavbarComponent {
    authService = inject(AuthService);
}

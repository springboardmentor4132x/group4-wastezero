import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <aside class="sidebar p-4" *ngIf="authService.isLoggedIn()">
      <div class="user-info">
        <h3>Menu</h3>
        <p>Logged in as: <strong>{{ authService.getRole() | titlecase }}</strong></p>
      </div>

      <nav class="nav-menu mt-4">
        <!-- Common -->
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
        
        <!-- User Sidebar -->
        <ng-container *ngIf="authService.getRole() === 'user'">
          <a routerLink="/schedule-pickup" routerLinkActive="active" class="nav-link">Schedule Pickup</a>
        </ng-container>

        <!-- Volunteer Sidebar -->
        <ng-container *ngIf="authService.getRole() === 'volunteer'">
          <a routerLink="/opportunities" routerLinkActive="active" class="nav-link">Opportunities</a>
        </ng-container>

        <!-- Admin Sidebar -->
        <ng-container *ngIf="authService.getRole() === 'admin'">
          <a routerLink="/admin" routerLinkActive="active" class="nav-link">Admin Panel</a>
        </ng-container>

        <!-- Common -->
        <a routerLink="/messages" routerLinkActive="active" class="nav-link">Messages</a>
        <a routerLink="/profile" routerLinkActive="active" class="nav-link">Profile</a>
      </nav>
    </aside>
  `,
    styles: [`
    .user-info {
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 20px;
    }
    .user-info h3 { font-size: 1.2rem; }
    .user-info p { font-size: 0.9rem; color: #e0e0e0; }
    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 10px 15px;
      border-radius: 6px;
      transition: background 0.3s;
      display: block;
    }
    .nav-link:hover {
      background: rgba(255,255,255,0.1);
    }
    .active {
      background: rgba(255,255,255,0.2);
      font-weight: 600;
    }
    .p-4 { padding: 1.5rem; }
    .mt-4 { margin-top: 1.5rem; }
  `]
})
export class SidebarComponent {
    authService = inject(AuthService);
}

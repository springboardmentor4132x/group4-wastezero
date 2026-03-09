import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="dashboard-wrapper">
      <div class="header-section">
        <h1>Welcome back, {{ authService.currentUser()?.name }}! 👋</h1>
        <p class="role-badge">Role: {{ authService.getRole() | titlecase }}</p>
      </div>

      <!-- USER DASHBOARD -->
      <div *ngIf="authService.getRole() === 'user'" class="role-dashboard">
        <h2>Your Waste Pickup Overview</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Scheduled Pickups</h3>
            <p class="display-value">0</p>
          </div>
          <div class="stat-card">
            <h3>Completed Pickups</h3>
            <p class="display-value">0</p>
          </div>
        </div>
        <div class="actions mt-x">
          <a routerLink="/schedule-pickup" class="action-btn">Schedule New Pickup</a>
          <a routerLink="/messages" class="action-btn secondary">Message Volunteers</a>
        </div>
      </div>

      <!-- VOLUNTEER DASHBOARD -->
      <div *ngIf="authService.getRole() === 'volunteer'" class="role-dashboard">
        <h2>Volunteer Dashboard</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Available Opportunities</h3>
            <p class="display-value">0</p>
          </div>
          <div class="stat-card">
            <h3>Completed Pickups</h3>
            <p class="display-value">0</p>
          </div>
        </div>
        <div class="actions mt-x">
          <a routerLink="/opportunities" class="action-btn">View Opportunities</a>
          <a routerLink="/messages" class="action-btn secondary">Check Messages</a>
        </div>
      </div>

      <!-- ADMIN DASHBOARD -->
      <div *ngIf="authService.getRole() === 'admin'" class="role-dashboard">
        <h2>System Overview</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Users</h3>
            <p class="display-value">0</p>
          </div>
          <div class="stat-card">
            <h3>Active Volunteers</h3>
            <p class="display-value">0</p>
          </div>
          <div class="stat-card">
            <h3>Total Pickups</h3>
            <p class="display-value">0</p>
          </div>
        </div>
        <div class="actions mt-x">
          <a routerLink="/admin" class="action-btn">Manage System</a>
          <a routerLink="/messages" class="action-btn secondary">System Messages</a>
        </div>
      </div>

    </div>
  `,
    styles: [`
    .dashboard-wrapper {
      padding: 20px;
      max-width: 1000px;
    }
    .header-section {
      margin-bottom: 30px;
    }
    .header-section h1 {
      font-size: 2rem;
      color: #1b5e20;
      margin-bottom: 5px;
    }
    .role-badge {
      display: inline-block;
      background: #e8f5e9;
      color: #2e7d32;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 10px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #fff;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      border: 1px solid #eee;
      text-align: center;
    }
    .stat-card h3 {
      font-size: 1rem;
      color: #666;
      margin-bottom: 10px;
      font-weight: 500;
    }
    .display-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2e7d32;
    }
    .mt-x { margin-top: 30px; }
    .action-btn {
      display: inline-block;
      padding: 12px 24px;
      background: #2e7d32;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-right: 15px;
      transition: background 0.3s;
    }
    .action-btn:hover { background: #1b5e20; }
    .action-btn.secondary {
      background: white;
      color: #2e7d32;
      border: 2px solid #2e7d32;
      padding: 10px 22px;
    }
    .action-btn.secondary:hover {
      background: #e8f5e9;
    }
  `]
})
export class DashboardComponent {
    authService = inject(AuthService);
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  role: string | null = null;
  displayName: string | null = null;
  unreadCount = 0;
  notifications: any[] = [];
  showDropdown = false;

  constructor(
    private authService: AuthService,
    public notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.displayName = this.authService.getName();

    this.loadNotifications();
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.notifications = res.data;
          const unread = this.notifications.filter(n => !n.isRead).length;
          this.notificationService.setUnreadCount(unread);
        }
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.loadNotifications();
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.loadNotifications();
    });
  }

  toggleDarkMode(): void {
    document.documentElement.classList.toggle('dark');
  }

  logout(): void {
    this.authService.logout();
  }
}
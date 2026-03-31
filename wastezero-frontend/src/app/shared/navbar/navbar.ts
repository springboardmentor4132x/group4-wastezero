import { Component, OnInit, OnDestroy, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {

  role: string | null = null;
  userName: string | null = null;
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;
  private notifSub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role     = localStorage.getItem('role');
    this.userName = localStorage.getItem('name');
    this.loadNotifications();
    this.loadUnreadCount();

    this.notifSub = this.notificationService.notification$.subscribe((notif: any) => {
      this.notifications.unshift(notif);
      this.unreadCount++;
      this.cdr.detectChanges(); // ← real-time notif update
    });
  }

  ngOnDestroy(): void {
    this.notifSub?.unsubscribe();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (res: any) => {
        this.unreadCount = res.count;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.cdr.detectChanges();
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  markOneRead(id: string): void {
    this.notificationService.markOneRead(id).subscribe({
      next: () => {
        const notif = this.notifications.find(n => n._id === id);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showNotifications = false;
      this.cdr.detectChanges();
    }
  }

  getRoleColor(): string {
    if (this.role === 'admin')     return 'bg-yellow-400';
    if (this.role === 'volunteer') return 'bg-teal-400';
    return 'bg-green-400';
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}
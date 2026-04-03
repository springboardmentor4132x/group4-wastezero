import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe, FormsModule],
  templateUrl: './user-dashboard.html',
})
export class UserDashboard implements OnInit {

  // Form Properties
  address = '';
  wasteType = 'plastic';
  quantity = '';
  preferredDate = '';
  notes = '';

  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  totalPickups = 0;
  completed = 0;
  pending = 0;
  recentActivity: any[] = [];
  userName: string | null = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userName = localStorage.getItem('name');
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    this.userService.getMyPickups().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          const pickups = res.data as any[];
          this.totalPickups = pickups.length;
          this.completed = pickups.filter(p => p.status === 'completed').length;
          this.pending = pickups.filter(p => p.status === 'pending').length;

          this.recentActivity = pickups.slice(0, 3).map(p => ({
            title: `${p.wasteType.toUpperCase()} Pickup ${p.status}`,
            desc: p.status === 'completed' ? 'Your recycling impact is growing!' : `Scheduled for ${new Date(p.preferredDate).toLocaleDateString()}`,
            icon: p.status === 'completed' ? '✅' : '🚚',
            time: this.getTimeAgo(p.createdAt || p.created_at)
          }));
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Dashboard Load Error:", err);
      }
    });
  }

  onSubmit() {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const data = {
      address: this.address,
      wasteType: this.wasteType,
      quantity: this.quantity,
      preferredDate: this.preferredDate,
      notes: this.notes
    };

    this.userService.schedulePickup(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Protocol Initialized: Pickup sequence scheduled.';
        this.resetForm();
        this.loadAllData();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Connection Fault: Failed to transmit mission data.';
      }
    });
  }

  resetForm() {
    this.address = '';
    this.wasteType = 'plastic';
    this.quantity = '';
    this.preferredDate = '';
    this.notes = '';
  }

  getTimeAgo(date: string) {
    if (!date) return 'N/A';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}M AGO`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}H AGO`;
    return `${Math.floor(seconds / 86400)}D AGO`;
  }

}
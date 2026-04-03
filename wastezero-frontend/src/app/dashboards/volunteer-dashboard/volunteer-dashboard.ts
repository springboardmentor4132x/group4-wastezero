import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { OpportunityService } from '../../services/opportunity.service';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './volunteer-dashboard.html',
  styleUrl: './volunteer-dashboard.css'
})
export class VolunteerDashboard implements OnInit {

  available = 0;
  accepted = 0;
  completed = 0;
  availablePickups: any[] = [];
  userName: string | null = '';
  recommendedOpportunities: any[] = [];
  isLoading = false;

  constructor(
    private userService: UserService,
    private opportunityService: OpportunityService
  ) { }

  ngOnInit() {
    this.userName = localStorage.getItem('name');
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    
    // Parallel execution for better performance
    Promise.all([
      this.loadStats(),
      this.loadRecommendations()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  loadStats(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAvailablePickups().subscribe({
        next: (res: any) => {
          if (res.success) {
            this.availablePickups = res.data;
            this.available = res.data.length;
          }
          resolve();
        },
        error: () => resolve()
      });

      this.userService.getMyPickups().subscribe({
        next: (res: any) => {
          if (res.success) {
            const myPickups = res.data as any[];
            this.accepted = myPickups.filter(p => p.status === 'accepted' || p.status === 'on-the-way').length;
            this.completed = myPickups.filter(p => p.status === 'completed').length;
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  acceptPickup(id: string) {
    if (!confirm("Add this pickup to your active duty?")) return;
    
    this.isLoading = true;
    this.userService.updatePickupStatus(id, 'accepted').subscribe({
      next: () => {
        this.loadAllData();
      },
      error: () => {
        this.isLoading = false;
        alert("System error. Check connection.");
      }
    });
  }

  loadRecommendations(): Promise<void> {
    return new Promise((resolve) => {
      this.opportunityService.getRecommendedOpportunities().subscribe({
        next: (res: any) => {
          if (res.success) this.recommendedOpportunities = res.data;
          resolve();
        },
        error: (err) => {
          console.error("Error loading recommendations", err);
          resolve();
        }
      });
    });
  }

}
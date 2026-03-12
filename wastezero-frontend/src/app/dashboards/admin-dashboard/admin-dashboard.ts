import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OpportunityService } from '../../services/opportunity.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {

  totalPickups = 0;
  totalOpportunities = 0;
  totalApplications = 0;
  totalVolunteers = 0;
  userName: string | null = '';

  constructor(
    private opportunityService: OpportunityService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userName = localStorage.getItem('name');
    this.loadStats();
  }

  loadStats() {
    this.opportunityService.getOpportunities().subscribe({
      next: (res: any) => {
        if (res.success) this.totalOpportunities = res.data.length;
      }
    });

    this.opportunityService.getApplications().subscribe({
      next: (res: any) => {
        if (res.success) this.totalApplications = res.data.length;
      }
    });

    this.userService.getAllPickups().subscribe({
      next: (res: any) => {
        if (res.success) this.totalPickups = res.data.length;
      }
    });

    this.userService.getUsers().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.totalVolunteers = res.data.filter((u: any) => u.role === 'volunteer').length;
        }
      }
    })
  }
}
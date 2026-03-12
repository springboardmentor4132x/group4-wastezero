import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

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
  userName: string | null = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userName = localStorage.getItem('name');
    this.loadStats();
  }

  loadStats() {
    this.userService.getAvailablePickups().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.available = res.data.length;
        }
      }
    });

    this.userService.getMyPickups().subscribe({
      next: (res: any) => {
        if (res.success) {
          const myPickups = res.data as any[];
          this.accepted = myPickups.filter(p => p.status === 'accepted' || p.status === 'on-the-way').length;
          this.completed = myPickups.filter(p => p.status === 'completed').length;
        }
      }
    })
  }

}
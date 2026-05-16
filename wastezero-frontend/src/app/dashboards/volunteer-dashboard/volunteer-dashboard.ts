import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './volunteer-dashboard.html',
})
export class VolunteerDashboard implements OnInit {

  available = 0;
  accepted  = 0;
  completed = 0;
  userName  = localStorage.getItem('name') || 'Volunteer';
  recentPickups: any[] = [];
  isLoading = true;

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/pickups/open`, this.getHeaders()).subscribe({
      next: (pickups) => {
        this.available    = pickups.length;
        this.recentPickups = pickups.slice(0, 3);
        this.cdr.detectChanges(); // ← FIXES THE BLANK SCREEN
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`${this.apiUrl}/pickups/accepted`, this.getHeaders()).subscribe({
      next: (pickups) => {
        this.isLoading = false;
        this.accepted  = pickups.filter(p => p.status === 'Accepted').length;
        this.completed = pickups.filter(p => p.status === 'Completed').length;
        this.cdr.detectChanges(); // ← FIXES THE BLANK SCREEN
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  getWasteIcon(type: string): string {
    const icons: any = {
      Plastic: '🧴', Organic: '🌿',
      'E-Waste': '💻', Metal: '🔩', Glass: '🫙'
    };
    return icons[type] || '🗑️';
  }
}
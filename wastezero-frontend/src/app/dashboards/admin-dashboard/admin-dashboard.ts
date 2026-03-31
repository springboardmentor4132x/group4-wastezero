import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  totalOpportunities = 0;
  totalVolunteers    = 0;
  totalApplications  = 0;
  totalPickups       = 0;
  completedPickups   = 0;
  pendingPickups     = 0;
  recentPickups: any[] = [];
  isLoading = true;

  private apiUrl = 'http://localhost:5000/api';

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

    this.http.get<any[]>(`${this.apiUrl}/pickups/all`, this.getHeaders()).subscribe({
      next: (pickups) => {
        this.totalPickups     = pickups.length;
        this.completedPickups = pickups.filter(p => p.status === 'Completed').length;
        this.pendingPickups   = pickups.filter(p => p.status === 'Open').length;
        this.recentPickups    = pickups.slice(0, 4);
        this.cdr.detectChanges(); // ← FIXES THE BLANK SCREEN
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`${this.apiUrl}/opportunities/all`, this.getHeaders()).subscribe({
      next: (opps) => {
        this.totalOpportunities = opps.length;
        this.cdr.detectChanges(); // ← FIXES THE BLANK SCREEN
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`${this.apiUrl}/applications`, this.getHeaders()).subscribe({
      next: (apps) => {
        this.totalApplications = apps.length;
        this.cdr.detectChanges(); // ← FIXES THE BLANK SCREEN
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`${this.apiUrl}/messages/users`, this.getHeaders()).subscribe({
      next: (users) => {
        this.isLoading       = false;
        this.totalVolunteers = users.filter((u: any) => u.role === 'volunteer').length;
        this.cdr.detectChanges(); // ← FIXES THE BLANK SCREEN
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open':      return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
      case 'Accepted':  return 'bg-teal-900/20 text-teal-400 border-teal-900/30';
      case 'Completed': return 'bg-green-900/20 text-green-400 border-green-900/30';
      default:          return 'bg-green-900/20 text-green-600 border-green-900/20';
    }
  }

  getWasteIcon(type: string): string {
    const icons: any = {
      Plastic: '🧴', Organic: '🌿',
      'E-Waste': '💻', Metal: '🔩', Glass: '🫙'
    };
    return icons[type] || '🗑️';
  }
}
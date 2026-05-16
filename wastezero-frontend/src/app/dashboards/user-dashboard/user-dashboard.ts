import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
})
export class UserDashboard implements OnInit {

  totalPickups = 0;
  completed = 0;
  pending = 0;
  accepted = 0;
  userName = localStorage.getItem('name') || 'User';

  wasteStats = [
    { label: 'Plastic', icon: '🧴', kg: 0 },
    { label: 'Organic', icon: '🌿', kg: 0 },
    { label: 'E-Waste', icon: '💻', kg: 0 },
    { label: 'Metal',   icon: '🔩', kg: 0 },
  ];

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

    this.http.get<any[]>(`${this.apiUrl}/pickups/my`, this.getHeaders()).subscribe({
      next: (pickups) => {
        this.isLoading    = false;
        this.totalPickups = pickups.length;
        this.completed    = pickups.filter(p => p.status === 'Completed').length;
        this.pending      = pickups.filter(p => p.status === 'Open').length;
        this.accepted     = pickups.filter(p => p.status === 'Accepted').length;
        this.recentPickups = pickups.slice(0, 3);

        const wasteMap: any = { Plastic: 0, Organic: 0, 'E-Waste': 0, Metal: 0 };
        pickups.forEach(p => {
          if (wasteMap[p.wasteType] !== undefined) wasteMap[p.wasteType]++;
        });

        this.wasteStats = [
          { label: 'Plastic', icon: '🧴', kg: wasteMap['Plastic'] },
          { label: 'Organic', icon: '🌿', kg: wasteMap['Organic'] },
          { label: 'E-Waste', icon: '💻', kg: wasteMap['E-Waste'] },
          { label: 'Metal',   icon: '🔩', kg: wasteMap['Metal'] },
        ];

        this.cdr.detectChanges(); // ← FIXES THE BLANK SCREEN
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Dashboard load error:', err);
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
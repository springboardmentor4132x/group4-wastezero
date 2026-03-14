import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-panel.component.html',
    styles: [`
    .admin-container { padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 0 auto; max-width: 1100px; }
    h2 { color: var(--primary-dark); margin-bottom: 25px; font-size: 1.8rem; border-bottom: 2px solid #f4f7f6; padding-bottom: 15px; }
    h3 { margin-bottom: 15px; color: #444; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 40px; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f9fbf9; color: #555; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; border-bottom: 2px solid #ddd; }
    tr:hover { background-color: #fcfcfc; }
    .badge { padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
    .badge.user { background: #e3f2fd; color: #1565c0; }
    .badge.volunteer { background: #fff3e0; color: #e65100; }
    .badge.admin { background: #ffebee; color: #c62828; }
    .btn-action { color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: bold; background: var(--primary-color); }
    .btn-delete { background: white; color: var(--error); border: 1px solid var(--error); margin-left: 10px; }
    .btn-delete:hover { background: #ffebee; }
  `]
})
export class AdminPanelComponent {
    users = [
        { id: '101', name: 'Yash', email: 'yash@example.com', role: 'user', location: 'Mumbai' },
        { id: '102', name: 'Rahul', email: 'rahul@example.com', role: 'volunteer', location: 'Pune' },
        { id: '103', name: 'System Admin', email: 'admin@wastezero.com', role: 'admin', location: 'HQ' },
        { id: '104', name: 'Ram', email: 'Ram@example.com', role: 'user', location: 'Suburbs' }
    ];

    pickups = [
        { id: '#P001', user: 'Yash', type: 'Plastic', status: 'Pending', date: '2026-03-05' },
        { id: '#P002', user: 'Rahul', type: 'E-Waste', status: 'Completed', date: '2026-03-02' }
    ];

    deleteUser(id: string) {
        if (confirm('Are you sure you want to remove this user from the system?')) {
            this.users = this.users.filter(u => u.id !== id);
        }
    }
}

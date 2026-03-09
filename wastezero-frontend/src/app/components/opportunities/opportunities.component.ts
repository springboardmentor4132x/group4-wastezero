import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-opportunities',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './opportunities.component.html',
    styles: [`
    .opp-container { max-width: 900px; margin: 0 auto; }
    h2 { color: var(--primary-dark); margin-bottom: 20px; }
    .pickup-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid var(--secondary-color); transition: transform 0.2s ease; }
    .pickup-card:hover { transform: translateY(-3px); }
    .pickup-info h4 { margin-bottom: 8px; color: #333; font-size: 1.2rem; }
    .pickup-info p { color: #555; font-size: 0.95rem; margin-bottom: 4px; }
  `]
})
export class OpportunitiesComponent {
    opportunities = [
        { id: 1, type: 'Plastic & E-Waste', quantity: 15, address: '123 Green Ave, City Center', date: '2026-03-05', time: '10:00 AM' },
        { id: 2, type: 'Organic Waste', quantity: 5, address: '45 Park Lane, Suburbs', date: '2026-03-06', time: '02:30 PM' },
        { id: 3, type: 'Mixed Household', quantity: 10, address: '88 River Rd, Northside', date: '2026-03-07', time: '11:00 AM' }
    ];

    acceptPickup(id: number) {
        if (confirm('Are you sure you want to accept this opportunity?')) {
            this.opportunities = this.opportunities.filter(o => o.id !== id);
            alert('Pickup opportunity accepted and added to your tasks!');
        }
    }
}

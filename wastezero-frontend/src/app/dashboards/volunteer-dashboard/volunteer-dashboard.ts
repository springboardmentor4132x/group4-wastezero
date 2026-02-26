import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './volunteer-dashboard.html',
  styleUrl: './volunteer-dashboard.css',
})
export class VolunteerDashboard {

}
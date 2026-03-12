import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {

  isLoggedIn = false;
  userRole: string | null = null;
  userName: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getRole();
    this.userName = this.authService.getName();

    // Auto-animate on entry
    this.startAnimations();
  }

  startAnimations() {
    // Logic for micro-animations if needed
  }

  goToDashboard() {
    if (this.userRole === 'user') this.router.navigate(['/dashboard-user']);
    else if (this.userRole === 'volunteer') this.router.navigate(['/dashboard-volunteer']);
    else if (this.userRole === 'admin') this.router.navigate(['/dashboard-admin']);
  }

}
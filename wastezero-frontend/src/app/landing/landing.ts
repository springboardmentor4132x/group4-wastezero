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
  kgRecycled = 0;
  activeUsers = 0;
  efficiency = 0;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getRole();
    this.userName = this.authService.getName();

    // Auto-animate on entry
    this.animateStats();
  }

  animateStats() {
    const duration = 2000; // 2 seconds
    const interval = 20;
    const steps = duration / interval;

    const targets = { kg: 1250430, users: 542, eff: 99.8 };
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      this.kgRecycled = Math.floor(targets.kg * progress);
      this.activeUsers = Math.floor(targets.users * progress);
      this.efficiency = parseFloat((targets.eff * progress).toFixed(1));

      if (currentStep >= steps) {
        this.kgRecycled = targets.kg;
        this.activeUsers = targets.users;
        this.efficiency = targets.eff;
        clearInterval(timer);
      }
    }, interval);
  }

  goToDashboard() {
    if (this.userRole === 'user') this.router.navigate(['/dashboard-user']);
    else if (this.userRole === 'volunteer') this.router.navigate(['/dashboard-volunteer']);
    else if (this.userRole === 'admin') this.router.navigate(['/dashboard-admin']);
  }

}
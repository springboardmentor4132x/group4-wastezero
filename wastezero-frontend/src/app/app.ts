import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Sidebar } from './shared/sidebar/sidebar';
import { Navbar } from './shared/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Navbar],
  templateUrl: './app.html',
})
export class App implements OnInit {

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      const loader = document.getElementById('global-loader');
      if (event instanceof NavigationStart) {
        loader?.classList.add('active', 'shimmer');
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => {
          loader?.classList.remove('active', 'shimmer');
        }, 300);
      }
    });
  }

  ngOnInit(): void {}

  // 🔥 Hide layout on Landing + Login + Register
  isAuthPage(): boolean {
    const publicRoutes = ['/', '/login', '/register'];
    return publicRoutes.includes(this.router.url);
  }
}
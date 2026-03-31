import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from './shared/sidebar/sidebar';
import { Navbar } from './shared/navbar/navbar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Navbar],
  templateUrl: './app.html',
})
export class App {

  currentUrl = '';

  constructor(public router: Router) {
    // ✅ Track URL changes properly — fixes isAuthPage() on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  isAuthPage(): boolean {
    const publicRoutes = ['/', '/login', '/register'];
    const url = this.currentUrl || this.router.url;
    return publicRoutes.some(route => url === route);
  }
}
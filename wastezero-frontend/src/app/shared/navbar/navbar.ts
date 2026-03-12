import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  role: string | null = null;
  displayName: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.displayName = this.authService.getName();
  }

  toggleDarkMode(): void {
    document.documentElement.classList.toggle('dark');
  }

  logout(): void {
    this.authService.logout();
  }
}
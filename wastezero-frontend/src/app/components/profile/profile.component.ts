import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styles: [`
    .profile-container { max-width: 650px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    h2 { color: var(--primary-dark); margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .info-row { display: flex; border-bottom: 1px solid #f5f5f5; padding: 18px 0; align-items: center; }
    .info-row label { width: 140px; font-weight: 600; color: #666; font-size: 0.95rem; }
    .info-row span { color: #222; font-size: 1.05rem; }
    .profile-header { display: flex; align-items: center; margin-bottom: 30px; gap: 20px; }
    .profile-avatar { width: 90px; height: 90px; background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    .profile-title { display: flex; flex-direction: column; }
    .profile-title h3 { margin: 0; font-size: 1.5rem; color: #333; }
    .profile-title p { margin: 5px 0 0 0; color: #888; font-size: 0.9rem; }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
  user = this.authService.currentUser();
}

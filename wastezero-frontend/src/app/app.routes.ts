import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [

  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing').then(m => m.Landing)
  },

  // PUBLIC ROUTES
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register').then(m => m.Register)
  },

  // USER ROUTES (Protected)
  {
    path: 'dashboard-user',
    loadComponent: () =>
      import('./dashboards/user-dashboard/user-dashboard').then(m => m.UserDashboard),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['user'] }
  },

  {
    path: 'schedule-pickup',
    loadComponent: () =>
      import('./user/schedule-pickup/schedule-pickup').then(m => m.SchedulePickup),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['user'] }
  },

  // VOLUNTEER ROUTES (Protected)
  {
    path: 'dashboard-volunteer',
    loadComponent: () =>
      import('./dashboards/volunteer-dashboard/volunteer-dashboard').then(m => m.VolunteerDashboard),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['volunteer'] }
  },

  {
    path: 'opportunities',
    loadComponent: () =>
      import('./volunteer/opportunities/opportunities').then(m => m.Opportunities),
    canActivate: [authGuard, roleGuard],
    runGuardsAndResolvers: 'always',
    data: { roles: ['volunteer'] }
  },
  {
    path: 'volunteer/pickups',
    loadComponent: () =>
      import('./admin/pickups/pickups').then(m => m.AdminPickups),
    canActivate: [authGuard, roleGuard],
    runGuardsAndResolvers: 'always',
    data: { roles: ['volunteer'] }
  },

  // ADMIN ROUTES (Protected)
  {
    path: 'dashboard-admin',
    loadComponent: () =>
      import('./dashboards/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },

  {
    path: 'admin/applications',
    loadComponent: () =>
      import('./admin/applications/applications').then(m => m.Applications),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-panel/admin-panel').then(m => m.AdminPanel),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/pickups',
    loadComponent: () =>
      import('./admin/pickups/pickups').then(m => m.AdminPickups),
    canActivate: [authGuard, roleGuard],
    runGuardsAndResolvers: 'always',
    data: { roles: ['admin'] }
  },

  // COMMON ROUTES (Protected)
  {
    path: 'messages',
    loadComponent: () =>
      import('./messages/messages').then(m => m.Messages),
    canActivate: [authGuard]
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },

  // FALLBACK
  { path: '**', redirectTo: 'login' }

];
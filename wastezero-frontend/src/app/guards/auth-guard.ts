import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';      // 🔒 Simple auth guard checking for token presence

export const authGuard: CanActivateFn = (route, state) => {  // 🔒 Simple auth guard checking for token presence

  const router = inject(Router);
  const token = localStorage.getItem('token');  // ✅ Check if token exists

  if (!token) {
    router.navigate(['/login']);     // 🚫 Redirect to login if not authenticated
    return false;
  }

  return true;              // ✅ Allow access if token is present
};
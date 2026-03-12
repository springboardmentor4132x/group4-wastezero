import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const role = localStorage.getItem('role');
    const expectedRoles = route.data['roles'] as Array<string>;

    if (!role || !expectedRoles.includes(role)) {
        // If user role is invalid, redirect based on their role or login
        if (role === 'admin') {
            return router.createUrlTree(['/dashboard-admin']);
        } else if (role === 'volunteer') {
            return router.createUrlTree(['/dashboard-volunteer']);
        } else if (role === 'user') {
            return router.createUrlTree(['/dashboard-user']);
        }
        return router.createUrlTree(['/login']);
    }

    return true;
};

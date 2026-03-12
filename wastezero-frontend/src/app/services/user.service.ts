import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = 'http://localhost:5000/api';

    constructor(private http: HttpClient) { }

    // Pickups
    schedulePickup(data: any) {
        return this.http.post(`${this.apiUrl}/pickups`, data);
    }

    getMyPickups() {
        return this.http.get(`${this.apiUrl}/pickups/my`);
    }

    getAllPickups() {
        return this.http.get(`${this.apiUrl}/pickups/all`);
    }

    getAvailablePickups() {
        return this.http.get(`${this.apiUrl}/pickups/available`);
    }

    updatePickupStatus(id: string, status: string) {
        return this.http.put(`${this.apiUrl}/pickups/${id}/status`, { status });
    }

    // Profile Management
    getProfile() {
        return this.http.get(`${this.apiUrl}/auth/profile`);
    }

    updateProfile(data: any) {
        return this.http.put(`${this.apiUrl}/auth/profile`, data);
    }

    changePassword(data: any) {
        return this.http.post(`${this.apiUrl}/auth/change-password`, data);
    }

    // Admin: Platform Users
    getUsers() {
        return this.http.get(`${this.apiUrl}/auth/users`);
    }

    updateUserRole(userId: string, role: string) {
        return this.http.put(`${this.apiUrl}/auth/users/role`, { userId, role });
    }

    deleteUser(userId: string) {
        return this.http.delete(`${this.apiUrl}/auth/users/${userId}`);
    }

}

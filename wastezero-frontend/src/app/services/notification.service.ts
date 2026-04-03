import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private apiUrl = 'http://localhost:5000/api/notifications';
    private socket: Socket;
    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient) {
        this.socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10
        });

        this.socket.on('connect_error', (err) => {
        });

        this.initSocketListener();
    }

    private initSocketListener() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.socket.emit('join', userId);
        }

        this.socket.on('new_notification', (notification: any) => {
            this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
            // Optionally play sound or show toast
        });
    }

    getNotifications() {
        return this.http.get<any>(this.apiUrl);
    }

    markAsRead(id: string) {
        return this.http.put(`${this.apiUrl}/${id}/read`, {});
    }

    markAllAsRead() {
        this.unreadCountSubject.next(0);
        return this.http.put(`${this.apiUrl}/read-all`, {});
    }

    setUnreadCount(count: number) {
        this.unreadCountSubject.next(count);
    }
}

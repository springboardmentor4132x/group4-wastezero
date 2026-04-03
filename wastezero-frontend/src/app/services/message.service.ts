import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private apiUrl = 'http://localhost:5000/api/messages';
    private socket: Socket;

    constructor(private http: HttpClient) {
        this.socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true
        });

        this.socket.on('connect_error', (err) => {
            console.error('💬 Chat Socket connection error:', err.message);
        });

        // Ensure room joining on reconnection
        this.socket.on('connect', () => {
            const userId = localStorage.getItem('userId');
            if (userId) this.joinRoom(userId);
        });
    }

    joinRoom(userId: string) {
        this.socket.emit('join', userId);
    }

    onNewMessage(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('receive_message', (data) => observer.next(data));
        });
    }


    getChatUsers() {
        return this.http.get(`${this.apiUrl}/users`);
    }

    getMessages(otherUserId: string) {
        return this.http.get(`${this.apiUrl}/${otherUserId}`);
    }

    searchUsers(query: string) {
        return this.http.get(`${this.apiUrl}/search?query=${query}`);
    }

    sendMessage(receiverId: string, content: string) {
        return this.http.post(`${this.apiUrl}`, { receiverId, content });
    }
}

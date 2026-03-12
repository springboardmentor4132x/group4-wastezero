import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private apiUrl = 'http://localhost:5000/api/messages';

    constructor(private http: HttpClient) { }

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

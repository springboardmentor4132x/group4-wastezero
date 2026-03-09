import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './messages.component.html',
    styles: [`
    .messages-container { display: flex; height: 75vh; background: #fff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; margin-top: 10px; }
    .chat-list { width: 35%; border-right: 1px solid #eee; background: #fdfdfd; display: flex; flex-direction: column; }
    .list-header { padding: 20px; font-weight: bold; border-bottom: 1px solid #eee; background: white; font-size: 1.2rem; }
    .chat-window { width: 65%; display: flex; flex-direction: column; }
    .chat-item { padding: 15px 20px; border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.2s; }
    .chat-item:hover { background: #f4f7f6; }
    .chat-item.active { background: #e8f5e9; border-left: 4px solid var(--primary-color); }
    .chat-header { padding: 20px; border-bottom: 1px solid #eee; background: white; font-weight: bold; font-size: 1.2rem; color: var(--primary-dark); }
    .chat-messages { flex: 1; padding: 20px; overflow-y: auto; background: #fafafa; display: flex; flex-direction: column; }
    .chat-input { padding: 15px 20px; border-top: 1px solid #eee; display: flex; background: white; }
    .chat-input input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-size: 1rem; }
    .chat-input button { margin-left: 10px; background: var(--primary-color); color: white; border: none; padding: 0 25px; border-radius: 20px; cursor: pointer; font-weight: bold; }
    .chat-input button:hover { background: var(--primary-dark); }
    .msg { max-width: 65%; padding: 12px 16px; border-radius: 18px; margin-bottom: 12px; font-size: 0.95rem; line-height: 1.4; }
    .msg.received { background: white; border: 1px solid #eee; align-self: flex-start; border-top-left-radius: 4px; }
    .msg.sent { background: #e8f5e9; color: var(--primary-dark); align-self: flex-end; border-top-right-radius: 4px; }
  `]
})
export class MessagesComponent {
    contacts = [
        { id: 1, name: 'System Admin', lastMsg: 'Welcome to WasteZero!' },
        { id: 2, name: 'Volunteer #1042', lastMsg: 'I will be arriving in 10 mins.' }
    ];
    activeContactId = 2;
}

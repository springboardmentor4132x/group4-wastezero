import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit, OnDestroy {

  conversations: any[] = [];
  selectedChat: any = null;
  newMessage = '';
  messages: any[] = [];
  currentUserId: string | null = '';
  refreshInterval: any;

  // Search Protocol
  isSearching = false;
  searchQuery = '';
  searchResults: any[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('userId');
    this.loadConversations();

    // Industrial Sim-Realtime (Polling)
    this.refreshInterval = setInterval(() => {
      if (this.selectedChat && !this.isSearching) {
        this.loadMessages(this.selectedChat._id);
      }
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadConversations() {
    this.messageService.getChatUsers().subscribe({
      next: (res: any) => {
        if (res.success) this.conversations = res.data;
      }
    });
  }

  toggleSearch() {
    this.isSearching = !this.isSearching;
    this.searchQuery = '';
    this.searchResults = [];
    if (!this.isSearching) this.loadConversations();
  }

  onSearch() {
    if (this.searchQuery.length < 2) {
      this.searchResults = [];
      return;
    }
    this.messageService.searchUsers(this.searchQuery).subscribe({
      next: (res: any) => {
        if (res.success) this.searchResults = res.data;
      }
    });
  }

  selectChat(chat: any) {
    this.selectedChat = chat;
    this.isSearching = false;
    this.loadMessages(chat._id);
  }

  loadMessages(otherUserId: string) {
    this.messageService.getMessages(otherUserId).subscribe({
      next: (res: any) => {
        if (res.success) {
          const oldLen = this.messages.length;
          this.messages = (res.data as any[]).map(m => ({
            text: m.content,
            sent: m.sender === this.currentUserId,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));

          if (this.messages.length > oldLen) {
            this.scrollToBottom();
          }
        }
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChat) return;

    const content = this.newMessage;
    this.newMessage = '';

    this.messageService.sendMessage(this.selectedChat._id, content).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.loadMessages(this.selectedChat._id);
          this.loadConversations(); // Update list order/existence
        }
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById('chat-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}

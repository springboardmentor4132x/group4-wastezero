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
  isSearching = false;
  isLoadingConversations = false;
  isLoadingMessages = false;
  searchQuery = '';
  searchResults: any[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('userId');
    if (this.currentUserId) {
      this.messageService.joinRoom(this.currentUserId);
    }
    this.loadConversations();

    // Real-time socket listener
    this.messageService.onNewMessage().subscribe({
      next: (data: any) => {
        // Only add if it's from the currently selected chat
        if (this.selectedChat && data.sender === this.selectedChat._id) {
          const msg = {
            text: data.content,
            sent: false,
            time: new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          this.messages.push(msg);
          this.scrollToBottom();
        } else {
          // Update conversation list to show new message/notification
          this.loadConversations();
        }
      }
    });
  }

  ngOnDestroy(): void {}

  loadConversations() {
    this.isLoadingConversations = true;
    this.messageService.getChatUsers().subscribe({
      next: (res: any) => {
        this.isLoadingConversations = false;
        if (res.success) this.conversations = res.data;
      },
      error: () => this.isLoadingConversations = false
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
    this.isLoadingMessages = true;
    this.messageService.getMessages(otherUserId).subscribe({
      next: (res: any) => {
        this.isLoadingMessages = false;
        if (res.success) {
          this.messages = (res.data as any[]).map(m => ({
            text: m.content,
            sent: m.sender === this.currentUserId,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          this.scrollToBottom();
        }
      },
      error: () => this.isLoadingMessages = false
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChat) return;

    const content = this.newMessage;
    this.newMessage = '';

    this.messageService.sendMessage(this.selectedChat._id, content).subscribe({
      next: (res: any) => {
        if (res.success) {
          // Optimistically add the message to the list
          this.messages.push({
            text: content,
            sent: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          this.scrollToBottom();
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

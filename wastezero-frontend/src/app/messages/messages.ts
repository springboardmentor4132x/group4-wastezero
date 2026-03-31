import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('chatBox') chatBox!: ElementRef;

  inbox: any[] = [];
  allUsers: any[] = [];
  messages: any[] = [];
  selectedUser: any = null;
  newMessage = '';
  myId = localStorage.getItem('userId') || '';
  searchQuery = '';
  isLoadingMessages = false;
  private msgSub!: Subscription;
  private shouldScroll = false;

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInbox();
    this.loadUsers();

    this.msgSub = this.messageService.message$.subscribe((msg: any) => {
      const senderId   = msg.sender_id?._id   || msg.sender_id;
      const receiverId = msg.receiver_id?._id || msg.receiver_id;

      if (this.selectedUser) {
        const selectedId = this.selectedUser._id;
        if (
          (senderId === selectedId && receiverId === this.myId) ||
          (senderId === this.myId  && receiverId === selectedId)
        ) {
          this.messages.push(msg);
          this.shouldScroll = true;
        }
      }
      this.loadInbox();
      this.cdr.detectChanges();
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.msgSub?.unsubscribe();
  }

  loadInbox() {
    this.messageService.getInbox().subscribe({
      next: (res: any) => {
        this.inbox = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadUsers() {
    this.messageService.getUsers().subscribe({
      next: (res: any) => {
        this.allUsers = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.messages = [];
    this.loadConversation(user._id);
    this.cdr.detectChanges();
  }

  loadConversation(userId: string) {
    this.isLoadingMessages = true;
    this.messageService.getConversation(userId).subscribe({
      next: (res: any) => {
        this.isLoadingMessages = false;
        this.messages = res;
        this.shouldScroll = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingMessages = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const content = this.newMessage.trim();
    this.newMessage = '';

    this.messageService.sendMessage(this.selectedUser._id, content).subscribe({
      next: (res: any) => {
        this.messages.push(res.data);
        this.shouldScroll = true;
        this.loadInbox();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  scrollToBottom() {
    try {
      if (this.chatBox?.nativeElement) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    } catch {}
  }

  isMe(msg: any): boolean {
    const senderId = msg.sender_id?._id || msg.sender_id;
    return senderId?.toString() === this.myId?.toString();
  }

  get filteredUsers() {
    if (!this.searchQuery) return this.allUsers;
    return this.allUsers.filter(u =>
      u.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getRoleColor(role: string): string {
    if (role === 'admin')     return 'text-yellow-400';
    if (role === 'volunteer') return 'text-teal-400';
    return 'text-green-400';
  }

  getAvatarClass(role: string): string {
    if (role === 'admin')     return 'bg-yellow-900/40 text-yellow-400';
    if (role === 'volunteer') return 'bg-teal-900/40 text-teal-400';
    return 'bg-green-900/40 text-green-400';
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  }
}
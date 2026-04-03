import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  user: any = {
    name: '',
    email: '',
    role: '',
    location: '',
    created_at: ''
  };

  passwords = {
    current: '',
    new: '',
    confirm: ''
  };

  allUsers: any[] = [];
  filteredUsers: any[] = [];
  currentFilter: string = 'all';

  isEditing = false;
  isChangingPassword = false;
  isManagingUsers = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getProfile().subscribe({
      next: (res: any) => {
        console.log("🚀 Industrial Profile Data Received:", res);
        this.isLoading = false;
        if (res && res.success) {
          this.user = res.data;
          console.log("✅ Identity context established for:", this.user.name);
        } else {
          this.errorMessage = res?.message || 'Identity retrieval protocol failed.';
        }
      },
      error: (err) => {
        console.error("🔥 Profile Load Error:", err);
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to sync with industrial identity registry.';
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.isChangingPassword = false;
    this.isManagingUsers = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  toggleChangePassword() {
    this.isChangingPassword = !this.isChangingPassword;
    this.isEditing = false;
    this.isManagingUsers = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.passwords = { current: '', new: '', confirm: '' };
  }

  toggleManageUsers() {
    this.isManagingUsers = !this.isManagingUsers;
    this.isEditing = false;
    this.isChangingPassword = false;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.isManagingUsers) {
      this.loadAllUsers();
    }
  }

  loadAllUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.allUsers = res.data;
          this.applyFilter('all');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load system users';
      }
    });
  }

  applyFilter(role: string) {
    this.currentFilter = role;
    if (role === 'all') {
      this.filteredUsers = this.allUsers;
    } else {
      this.filteredUsers = this.allUsers.filter(u => u.role === role);
    }
  }

  onSave() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.updateProfile(this.user).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isEditing = false;
        if (res.success) {
          this.user = res.data;
          localStorage.setItem('name', this.user.name);
          this.successMessage = 'Profile updated successfully!';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error updating profile';
      }
    });
  }

  onChangePassword() {
    if (this.passwords.new !== this.passwords.confirm) {
      this.errorMessage = "New passwords do not match";
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.changePassword({
      currentPassword: this.passwords.current,
      newPassword: this.passwords.new
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isChangingPassword = false;
        this.successMessage = 'Password changed successfully!';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error changing password';
      }
    });
  }

  getRoleCount(role: string): number {
    return this.allUsers.filter(u => u.role === role).length;
  }

  updateRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'volunteer' : 'admin'; // Toggle or prompt
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    this.isLoading = true;
    this.userService.updateUserRole(userId, newRole).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.loadAllUsers(); // Refresh registry
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error updating role';
      }
    });
  }

  deleteUser(userId: string) {
    if (!confirm('CRITICAL: Are you sure you want to permanently delete this user from the registry?')) return;

    this.isLoading = true;
    this.userService.deleteUser(userId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.loadAllUsers(); // Refresh registry
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error deleting user';
      }
    });
  }
}

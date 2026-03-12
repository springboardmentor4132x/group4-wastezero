import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-schedule-pickup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-pickup.html',
  styleUrl: './schedule-pickup.css',
})
export class SchedulePickup {
  address = '';
  wasteType = 'plastic';
  quantity = '';
  preferredDate = '';
  notes = '';

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) { }

  onSubmit() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const data = {
      address: this.address,
      wasteType: this.wasteType,
      quantity: this.quantity,
      preferredDate: this.preferredDate,
      notes: this.notes
    };

    this.userService.schedulePickup(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = 'Pickup scheduled successfully!';
        this.resetForm();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to schedule pickup';
      }
    });
  }

  resetForm() {
    this.address = '';
    this.wasteType = 'plastic';
    this.quantity = '';
    this.preferredDate = '';
    this.notes = '';
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PickupService } from '../../services/pickup.service';

@Component({
  selector: 'app-schedule-pickup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule-pickup.html',
  styleUrl: './schedule-pickup.css'
})
export class SchedulePickup implements OnInit {

  pickupForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  myPickups: any[] = [];

  wasteTypes = ['Plastic', 'Organic', 'E-Waste', 'Metal', 'Glass', 'Other'];

  constructor(
    private fb: FormBuilder,
    private pickupService: PickupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pickupForm = this.fb.group({
      wasteType:     ['', Validators.required],
      description:   [''],
      quantity:      ['', Validators.required],
      address:       ['', Validators.required],
      preferredDate: ['', Validators.required],
      preferredTime: ['', Validators.required],
      contactNumber: ['']
    });

    this.loadMyPickups();
  }

  loadMyPickups() {
    this.pickupService.getMyPickups().subscribe({
      next: (res: any) => {
        this.myPickups = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.pickupForm.invalid) {
      this.pickupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.pickupService.createPickup(this.pickupForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Pickup request submitted successfully!';
        this.pickupForm.reset();
        this.loadMyPickups();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Open':      return 'text-yellow-400';
      case 'Accepted':  return 'text-teal-400';
      case 'Completed': return 'text-green-400';
      case 'Cancelled': return 'text-red-400';
      default:          return 'text-green-600';
    }
  }
}
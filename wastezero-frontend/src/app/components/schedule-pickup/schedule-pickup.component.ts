import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-schedule-pickup',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './schedule-pickup.component.html',
    styles: [`
    .pickup-container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h2 { color: var(--primary-dark); margin-bottom: 20px; }
  `]
})
export class SchedulePickupComponent {
    pickupForm: FormGroup;
    successMessage = '';

    private fb = inject(FormBuilder);

    constructor() {
        this.pickupForm = this.fb.group({
            wasteType: ['', Validators.required],
            quantity: ['', [Validators.required, Validators.min(1)]],
            date: ['', Validators.required],
            time: ['', Validators.required],
            address: ['', Validators.required],
            notes: ['']
        });
    }

    onSubmit() {
        if (this.pickupForm.valid) {
            console.log('Pickup scheduled:', JSON.stringify(this.pickupForm.value));
            this.successMessage = 'Waste pickup scheduled successfully!';
            this.pickupForm.reset();
            setTimeout(() => this.successMessage = '', 3000);
        } else {
            this.pickupForm.markAllAsTouched();
        }
    }
}

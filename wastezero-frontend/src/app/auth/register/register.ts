import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {

      const selectedRole = this.registerForm.value.role;

      // 🔥 Save role properly
      localStorage.setItem('role', selectedRole);

      alert('Registration Successful!');

      this.router.navigate(['/login']);

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
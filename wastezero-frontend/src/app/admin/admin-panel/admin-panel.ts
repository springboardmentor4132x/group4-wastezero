import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OpportunityService } from '../../services/opportunity.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel implements OnInit {

  title = '';
  description = '';
  skills = '';
  duration = '';
  location = '';
  editingId: string | null = null;
  opportunities: any[] = [];
  isLoading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private opportunityService: OpportunityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOpportunities();
  }

  loadOpportunities() {
    this.isLoading = true;
    this.opportunityService.getOpportunities().subscribe({
      next: (res: any) => {
        this.opportunities = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  createOpportunity() {
    if (!this.title || !this.description || !this.skills || !this.duration || !this.location) {
      this.errorMessage = 'Please fill in all required fields.';
      this.cdr.detectChanges();
      return;
    }

    const data = {
      title:          this.title,
      description:    this.description,
      requiredSkills: this.skills.split(',').map(s => s.trim()).filter(Boolean),
      duration:       this.duration,
      location:       this.location
    };

    if (this.editingId) {
      this.opportunityService.updateOpportunity(this.editingId, data).subscribe({
        next: () => {
          this.successMessage = 'Opportunity updated successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadOpportunities();
          this.cdr.detectChanges();
          setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.opportunityService.createOpportunity(data).subscribe({
        next: () => {
          this.successMessage = 'Opportunity created successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadOpportunities();
          this.cdr.detectChanges();
          setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to create';
          this.cdr.detectChanges();
        }
      });
    }
  }

  editOpportunity(opp: any) {
    this.editingId   = opp._id;
    this.title       = opp.title;
    this.description = opp.description;
    this.skills      = opp.requiredSkills.join(', ');
    this.duration    = opp.duration;
    this.location    = opp.location;
    this.cdr.detectChanges();
  }

  deleteOpportunity(id: string) {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    this.opportunityService.deleteOpportunity(id).subscribe({
      next: () => {
        this.successMessage = 'Opportunity deleted successfully!';
        this.loadOpportunities();
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete';
        this.cdr.detectChanges();
      }
    });
  }

  resetForm() {
    this.title       = '';
    this.description = '';
    this.skills      = '';
    this.duration    = '';
    this.location    = '';
    this.editingId   = null;
    this.errorMessage = '';
  }
}
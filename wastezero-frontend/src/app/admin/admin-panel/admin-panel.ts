import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpportunityService } from '../../services/opportunity.service';
import { RouterModule } from '@angular/router';

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
  errorMessage = '';
  successMessage = '';

  opportunities: any[] = [];

  constructor(private opportunityService: OpportunityService) { }

  ngOnInit(): void {
    this.loadOpportunities();
  }

  loadOpportunities() {
    this.opportunityService.getOpportunities().subscribe({
      next: (res: any) => {
        this.opportunities = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  createOpportunity() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.title || !this.description || !this.skills || !this.duration || !this.location) {
      this.errorMessage = 'All fields are required';
      return;
    }

    const data = {
      title: this.title,
      description: this.description,
      requiredSkills: this.skills.split(',').map(s => s.trim()),
      duration: this.duration,
      location: this.location
    };

    if (this.editingId) {

      this.opportunityService.updateOpportunity(this.editingId, data)
        .subscribe({
          next: () => {

            this.successMessage = "Opportunity updated successfully";

            this.resetForm();
            this.loadOpportunities();

          },
          error: (err) => {
            this.errorMessage = err.error?.message || "Error updating opportunity";
          }
        });

    } else {

      this.opportunityService.createOpportunity(data)
        .subscribe({
          next: () => {

            this.successMessage = "Opportunity created successfully";

            this.resetForm();
            this.loadOpportunities();

          },
          error: (err) => {
            this.errorMessage = err.error?.message || "Error creating opportunity";
          }
        });

    }

  }

  editOpportunity(opp: any) {

    this.editingId = opp._id;

    this.title = opp.title;
    this.description = opp.description;
    this.skills = opp.requiredSkills.join(',');
    this.duration = opp.duration;
    this.location = opp.location;

  }

  deleteOpportunity(id: string) {

    if (!confirm("Are you sure you want to delete this opportunity?")) {
      return;
    }

    this.opportunityService.deleteOpportunity(id)
      .subscribe({
        next: () => {

          alert("Opportunity deleted successfully");

          this.loadOpportunities();

        },
        error: (err) => {
          this.errorMessage = err.error?.message || "Error deleting opportunity";
        }
      });

  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.skills = '';
    this.duration = '';
    this.location = '';
    this.editingId = null;
  }

}
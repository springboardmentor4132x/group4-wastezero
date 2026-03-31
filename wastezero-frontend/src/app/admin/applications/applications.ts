import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OpportunityService } from '../../services/opportunity.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications implements OnInit {

  applications: any[] = [];
  isLoading = true;

  constructor(
    private opportunityService: OpportunityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.isLoading = true;
    this.opportunityService.getApplications().subscribe({
      next: (res: any) => {
        this.applications = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  updateStatus(id: string, status: string) {
    this.opportunityService.updateApplicationStatus(id, status).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (err) => console.error(err)
    });
  }

  getCount(status: string): number {
    return this.applications.filter(a => a.status === status).length;
  }
}
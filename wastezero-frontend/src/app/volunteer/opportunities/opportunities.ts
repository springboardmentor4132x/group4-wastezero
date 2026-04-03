import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityService } from '../../services/opportunity.service';

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunities.html',
  styleUrl: './opportunities.css'
})
export class Opportunities implements OnInit {

  opportunities: any[] = [];
  appliedSet = new Set<string>();
  userName: string | null = '';
  isLoading = false;

  constructor(private opportunityService: OpportunityService) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('name');
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    Promise.all([
      this.loadOpportunitiesPromise(),
      this.loadApplicationsPromise()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  loadOpportunitiesPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.opportunityService.getOpportunities().subscribe({
        next: (res: any) => {
          this.opportunities = res.data;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  loadApplicationsPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.opportunityService.getApplications().subscribe({
        next: (res: any) => {
          if (res.success) {
            const userId = localStorage.getItem('userId');
            res.data.forEach((app: any) => {
              const appVolunteerId = app.volunteer_id?._id || app.volunteer_id;
              if (appVolunteerId?.toString() === userId?.toString()) {
                const oppId = app.opportunity_id?._id || app.opportunity_id;
                if (oppId) this.appliedSet.add(oppId.toString());
              }
            });
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  apply(opportunity_id: string) {
    this.opportunityService.applyOpportunity(opportunity_id)
      .subscribe({
        next: () => {
          alert("Application submitted successfully!");
          this.appliedSet.add(opportunity_id);
        },
        error: (err) => {
          alert(err.error?.message || "Error applying for opportunity");
          if (err.error?.message === "You already applied") {
            this.appliedSet.add(opportunity_id);
          }
        }
      });
  }

}
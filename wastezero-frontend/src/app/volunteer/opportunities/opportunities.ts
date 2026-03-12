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
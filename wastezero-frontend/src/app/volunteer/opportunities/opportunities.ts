import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PickupService } from '../../services/pickup.service';
import { OpportunityService } from '../../services/opportunity.service';

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './opportunities.html',
  styleUrl: './opportunities.css'
})
export class Opportunities implements OnInit {

  openPickups: any[] = [];
  acceptedPickups: any[] = [];
  adminOpportunities: any[] = [];
  matchedOpportunities: any[] = [];
  appliedIds: Set<string> = new Set();
  activeTab: 'pickups' | 'opportunities' | 'matched' | 'assignments' = 'pickups';

  hasSkills = false;
  hasLocation = false;
  showProfileTip = false;

  constructor(
    private pickupService: PickupService,
    private opportunityService: OpportunityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkProfile();
    this.loadOpenPickups();
    this.loadAdminOpportunities();
    this.loadAppliedIds();
    this.loadMatchedOpportunities();
  }

  checkProfile() {
    const skills   = localStorage.getItem('skills');
    const location = localStorage.getItem('location');
    const skillsArr = skills ? JSON.parse(skills) : [];
    this.hasSkills   = skillsArr.length > 0;
    this.hasLocation = !!(location && location.trim());
    this.showProfileTip = !this.hasSkills || !this.hasLocation;
  }

  loadOpenPickups() {
    this.pickupService.getOpenPickups().subscribe({
      next: (res: any) => {
        this.openPickups = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadAccepted() {
    this.pickupService.getMyAcceptedPickups().subscribe({
      next: (res: any) => {
        this.acceptedPickups = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  acceptPickup(id: string) {
    this.pickupService.acceptPickup(id).subscribe({
      next: () => {
        alert('Pickup accepted successfully!');
        this.loadOpenPickups();
      },
      error: (err) => alert(err.error?.message || 'Failed to accept pickup')
    });
  }

  completePickup(id: string) {
    this.pickupService.completePickup(id).subscribe({
      next: () => {
        alert('Pickup marked as completed!');
        this.loadAccepted();
      },
      error: (err) => alert(err.error?.message || 'Failed to complete pickup')
    });
  }

  loadAdminOpportunities() {
    this.opportunityService.getOpportunities().subscribe({
      next: (res: any) => {
        this.adminOpportunities = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadMatchedOpportunities() {
    this.opportunityService.getMatchedOpportunities().subscribe({
      next: (res: any) => {
        this.matchedOpportunities = res.filter((o: any) => o.matchScore > 0);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadAppliedIds() {
    this.opportunityService.getMyApplications().subscribe({
      next: (res: any) => {
        this.appliedIds = new Set(
          res.map((app: any) => app.opportunity_id?._id || app.opportunity_id)
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  hasApplied(opportunityId: string): boolean {
    return this.appliedIds.has(opportunityId);
  }

  applyOpportunity(id: string) {
    this.opportunityService.applyOpportunity(id).subscribe({
      next: () => {
        alert('Application submitted successfully!');
        this.loadAppliedIds();
        this.loadMatchedOpportunities();
      },
      error: (err) => alert(err.error?.message || 'Failed to apply')
    });
  }

  switchTab(tab: 'pickups' | 'opportunities' | 'matched' | 'assignments') {
    this.activeTab = tab;
    if (tab === 'assignments') this.loadAccepted();
    this.cdr.detectChanges();
  }

  getWasteIcon(type: string): string {
    const icons: any = {
      'Plastic': '🧴', 'Organic': '🌿',
      'E-Waste': '💻', 'Metal': '🔩', 'Glass': '🫙'
    };
    return icons[type] || '🗑️';
  }

  getMatchScoreColor(score: number): string {
    if (score >= 15) return 'text-green-400';
    if (score >= 10) return 'text-teal-400';
    if (score >= 5)  return 'text-yellow-400';
    return 'text-green-700';
  }

  getMatchScoreBg(score: number): string {
    if (score >= 15) return 'bg-green-900/20 border-green-900/30';
    if (score >= 10) return 'bg-teal-900/20 border-teal-900/30';
    if (score >= 5)  return 'bg-yellow-900/20 border-yellow-900/30';
    return 'bg-white/[0.02] border-green-900/20';
  }
}
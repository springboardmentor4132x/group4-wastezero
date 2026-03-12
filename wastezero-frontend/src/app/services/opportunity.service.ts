import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Opportunities
  createOpportunity(data: any) {
    return this.http.post(`${this.apiUrl}/opportunities`, data);
  }

  getOpportunities() {
    return this.http.get(`${this.apiUrl}/opportunities`);
  }

  updateOpportunity(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/opportunities/${id}`, data);
  }

  deleteOpportunity(id: string) {
    return this.http.delete(`${this.apiUrl}/opportunities/${id}`);
  }

  // Applications
  applyOpportunity(opportunity_id: string) {
    return this.http.post(`${this.apiUrl}/applications/apply`, { opportunity_id });
  }

  getApplications() {
    return this.http.get(`${this.apiUrl}/applications`);
  }

  updateApplicationStatus(id: string, status: string) {
    return this.http.put(`${this.apiUrl}/applications/${id}`, { status });
  }
}
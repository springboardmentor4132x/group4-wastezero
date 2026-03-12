import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-admin-pickups',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pickups.html',
})
export class AdminPickups implements OnInit {
    pickups: any[] = [];
    isLoading = false;

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadPickups();
    }

    loadPickups() {
        this.isLoading = true;
        this.userService.getAllPickups().subscribe({
            next: (res: any) => {
                this.isLoading = false;
                if (res.success) this.pickups = res.data;
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Error loading pickups', err);
            }
        });
    }

    updateStatus(id: string, status: string) {
        this.userService.updatePickupStatus(id, status).subscribe({
            next: (res: any) => {
                if (res.success) this.loadPickups();
            },
            error: (err) => {
                alert('Error updating pickup: ' + err.error?.message);
            }
        });
    }
}

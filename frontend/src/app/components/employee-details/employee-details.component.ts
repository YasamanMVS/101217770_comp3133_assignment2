import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  template: `
    <div class="employee-details-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Employee Details</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="employee; else loading">
            <div class="detail-row">
              <span class="label">First Name:</span>
              <span class="value">{{ employee.firstName }}</span>
            </div>

            <div class="detail-row">
              <span class="label">Last Name:</span>
              <span class="value">{{ employee.lastName }}</span>
            </div>

            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">{{ employee.email }}</span>
            </div>

            <div class="detail-row">
              <span class="label">Position:</span>
              <span class="value">{{ employee.position }}</span>
            </div>

            <div class="detail-row">
              <span class="label">Department:</span>
              <span class="value">{{ employee.department }}</span>
            </div>
          </div>

          <ng-template #loading>
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          </ng-template>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button routerLink="/employees">Back to List</button>
          <button mat-raised-button color="primary" [routerLink]="['/employees/edit', employeeId]" *ngIf="employeeId">
            Edit
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .employee-details-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .detail-row {
      display: flex;
      margin-bottom: 16px;
    }
    .label {
      font-weight: 500;
      width: 120px;
    }
    .value {
      flex: 1;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    mat-card-actions {
      padding: 16px;
    }
  `]
})
export class EmployeeDetailsComponent implements OnInit {
  employee: any;
  employeeId: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.employeeId = params['id'];
        if (this.employeeId) {
          this.loadEmployee(this.employeeId);
        }
      } else {
        this.router.navigate(['/employees']);
      }
    });
  }

  loadEmployee(id: string): void {
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employee = employee;
      },
      error: (error) => {
        this.snackBar.open('Error loading employee: ' + error.message, 'Close', {
          duration: 3000
        });
        this.router.navigate(['/employees']);
      }
    });
  }
}

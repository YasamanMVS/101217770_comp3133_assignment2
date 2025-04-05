import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="employee-form-container">
      <h1>{{ isEditMode ? 'Edit' : 'Add' }} Employee</h1>
      
      <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" placeholder="Enter first name">
          <mat-error *ngIf="employeeForm.get('firstName')?.hasError('required')">
            First name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" placeholder="Enter last name">
          <mat-error *ngIf="employeeForm.get('lastName')?.hasError('required')">
            Last name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="Enter email">
          <mat-error *ngIf="employeeForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="employeeForm.get('email')?.hasError('email')">
            Please enter a valid email address
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Position</mat-label>
          <input matInput formControlName="position" placeholder="Enter position">
          <mat-error *ngIf="employeeForm.get('position')?.hasError('required')">
            Position is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Department</mat-label>
          <mat-select formControlName="department">
            <mat-option value="HR">Human Resources</mat-option>
            <mat-option value="IT">Information Technology</mat-option>
            <mat-option value="Finance">Finance</mat-option>
            <mat-option value="Marketing">Marketing</mat-option>
            <mat-option value="Operations">Operations</mat-option>
            <mat-option value="Executive">Executive Management</mat-option>
          </mat-select>
          <mat-error *ngIf="employeeForm.get('department')?.hasError('required')">
            Department is required
          </mat-error>
        </mat-form-field>

        <div class="form-actions">
          <button mat-button type="button" routerLink="/employees">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="employeeForm.invalid || isLoading">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .employee-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = params['id'];
        if (this.employeeId) {
          this.loadEmployee(this.employeeId);
        }
      }
    });
  }

  loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue(employee);
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading employee: ' + error.message, 'Close', {
          duration: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const employeeData = this.employeeForm.value;

      const operation = this.isEditMode && this.employeeId
        ? this.employeeService.updateEmployee(this.employeeId, employeeData)
        : this.employeeService.createEmployee(employeeData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Employee ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditMode ? 'updating' : 'creating'} employee: ${error.message}`,
            'Close',
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    }
  }
}

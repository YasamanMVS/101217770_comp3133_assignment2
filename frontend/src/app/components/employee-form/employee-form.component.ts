import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../../models/employee.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="employee-form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit' : 'Add' }} Employee</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
            <!-- Profile Picture Section -->
            <div class="profile-pic-section">
              <div class="profile-pic-container" (click)="fileInput.click()">
                <img [src]="previewUrl || 'assets/default-avatar.svg'" alt="Profile picture" class="profile-pic">
                <div class="upload-overlay">
                  <mat-icon>photo_camera</mat-icon>
                  <span>Change Photo</span>
                </div>
              </div>
              <input
                #fileInput
                type="file"
                accept="image/*"
                style="display: none"
                (change)="onFileSelected($event)"
              >
            </div>

            <div class="form-fields">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName" placeholder="Enter first name">
                  <mat-error *ngIf="employeeForm.get('firstName')?.hasError('required')">
                    First name is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName" placeholder="Enter last name">
                  <mat-error *ngIf="employeeForm.get('lastName')?.hasError('required')">
                    Last name is required
                  </mat-error>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" placeholder="Enter email" type="email">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="employeeForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="employeeForm.get('email')?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Position</mat-label>
                  <input matInput formControlName="position" placeholder="Enter position">
                  <mat-icon matSuffix>work</mat-icon>
                  <mat-error *ngIf="employeeForm.get('position')?.hasError('required')">
                    Position is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Department</mat-label>
                  <mat-select formControlName="department">
                    <mat-option value="HR">Human Resources</mat-option>
                    <mat-option value="IT">Information Technology</mat-option>
                    <mat-option value="Finance">Finance</mat-option>
                    <mat-option value="Marketing">Marketing</mat-option>
                    <mat-option value="Operations">Operations</mat-option>
                    <mat-option value="Executive">Executive Management</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>business</mat-icon>
                  <mat-error *ngIf="employeeForm.get('department')?.hasError('required')">
                    Department is required
                  </mat-error>
                </mat-form-field>
              </div>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <div class="form-actions">
            <button mat-button type="button" routerLink="/employees" [disabled]="isLoading">
              Cancel
            </button>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="onSubmit()" 
              [disabled]="employeeForm.invalid || isLoading"
              class="submit-button"
            >
              <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </mat-card-actions>

        <div class="loading-overlay" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .employee-form-container {
      max-width: 800px;
      margin: 32px auto;
      padding: 0 20px;
    }

    .form-card {
      background-color: #2c2c2c;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    mat-card-header {
      padding: 24px;
      background-color: #8b0000;
      color: white;
      margin-bottom: 24px;
    }

    mat-card-title {
      font-size: 24px;
      font-weight: 500;
      margin: 0;
      color: white;
    }

    mat-card-content {
      padding: 0 24px 16px;
    }

    .profile-pic-section {
      display: flex;
      justify-content: center;
      margin: 24px 0 40px;
    }

    .profile-pic-container {
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      border: 4px solid #8b0000;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      
      &:hover .upload-overlay {
        opacity: 1;
      }
    }

    .profile-pic {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .upload-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(139, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transition: opacity 0.3s ease;

      mat-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      span {
        font-size: 14px;
      }
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 24px;
    }

    .form-row {
      display: flex;
      gap: 24px;
      
      mat-form-field {
        flex: 1;
      }
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    mat-card-actions {
      padding: 24px;
      margin: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
    }

    .submit-button {
      background-color: #8b0000;
      color: white;
      padding: 0 24px;
      height: 40px;
      
      &:hover:not([disabled]) {
        background-color: #660000;
      }

      mat-icon {
        margin-right: 8px;
      }
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    ::ng-deep {
      // Form field styles
      .mat-mdc-form-field {
        height: 68px;
        
        .mdc-text-field {
          padding: 0 12px;
        }
        
        .mat-mdc-form-field-flex {
          height: 56px;
        }
      }

      // Input text styles
      .mat-mdc-input-element {
        color: white !important;
        font-size: 16px;
        padding: 4px 0;
      }

      // Label styles
      .mat-mdc-floating-label {
        color: rgba(255, 255, 255, 0.6) !important;
      }

      // Outline styles
      .mdc-notched-outline__leading,
      .mdc-notched-outline__notch,
      .mdc-notched-outline__trailing {
        border-color: rgba(255, 255, 255, 0.2) !important;
      }

      // Icon styles
      .mat-mdc-form-field-icon-suffix {
        color: rgba(255, 255, 255, 0.5);
        padding-right: 8px;
      }

      // Select styles
      .mat-mdc-select-value {
        color: white;
        padding: 4px 0;
      }

      .mat-mdc-select-arrow {
        color: rgba(255, 255, 255, 0.5);
      }

      // Error message styles
      .mat-mdc-form-field-error-wrapper {
        padding: 0;
        position: absolute;
        top: 100%;
      }

      .mat-mdc-form-field-error {
        font-size: 12px;
        margin: 4px 0 0;
      }

      // Focus styles
      .mdc-text-field--focused {
        .mdc-notched-outline__leading,
        .mdc-notched-outline__notch,
        .mdc-notched-outline__trailing {
          border-color: #8b0000 !important;
          border-width: 2px;
        }
      }

      // Hover styles
      .mdc-text-field:hover {
        .mdc-notched-outline__leading,
        .mdc-notched-outline__notch,
        .mdc-notched-outline__trailing {
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
      }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee?: Employee;
  @Output() saved = new EventEmitter<Employee>();
  @Output() cancelled = new EventEmitter<void>();

  employeeForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  employeeId: string | null = null;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  errorMessage: string | null = null;

  departments = [
    'HR',
    'IT',
    'Finance',
    'Marketing',
    'Operations',
    'Sales'
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    if (this.employeeId) {
      this.isLoading = true;
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (employee) => {
          this.employeeForm.patchValue(employee);
          this.previewUrl = employee.profilePic || null;
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Error loading employee details', 'Close', { duration: 3000 });
          console.error('Error loading employee:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }

      if (!file.type.match(/image\/(jpeg|png|gif)$/)) {
        this.errorMessage = 'Only JPEG, PNG and GIF files are allowed';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = null;

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const employeeData = {
      ...this.employeeForm.value
    };

    // Add the actual File object if a file was selected
    if (this.selectedFile) {
      employeeData.profilePic = this.selectedFile;
    }

    const request = this.isEditMode
      ? this.employeeService.updateEmployee(this.employeeId!, employeeData)
      : this.employeeService.createEmployee(employeeData);

    request.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (employee) => {
        this.snackBar.open(
          `Employee ${this.isEditMode ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        const errorMsg = error.message || 'An error occurred while saving the employee';
        this.errorMessage = errorMsg;
        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getErrorMessage(controlName: string): string {
    const control = this.employeeForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number (10 digits)';
      }
      if (control.errors['min']) {
        return 'Salary must be greater than 0';
      }
    }
    return '';
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Enter email" type="email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Enter password">
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              class="submit-button"
            >
              <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              <span *ngIf="!isLoading">
                <mat-icon>login</mat-icon>
                Login
              </span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #1a1a1a;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      margin: 0 20px;
      background-color: #2c2c2c;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    mat-card-header {
      padding: 24px;
      background-color: #8b0000;
      border-radius: 12px 12px 0 0;
      margin-bottom: 0;
    }

    mat-card-title {
      color: white;
      font-size: 24px;
      font-weight: 500;
      margin: 0;
    }

    mat-card-content {
      padding: 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    mat-form-field {
      width: 100%;
    }

    .submit-button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      height: 48px;
      font-size: 16px;
    }

    mat-spinner {
      margin-right: 8px;
    }

    ::ng-deep {
      // Form field styles
      .mat-mdc-form-field {
        .mdc-text-field {
          background-color: transparent;
        }

        .mat-mdc-form-field-flex {
          background-color: transparent;
        }
      }

      // Input text styles
      .mat-mdc-input-element {
        color: white !important;
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

      // Error styles
      .mat-mdc-form-field-error-wrapper {
        padding: 0;
      }

      .mat-mdc-form-field-error {
        color: #f44336;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.message || 'Login failed', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  template: `
    <mat-toolbar color="primary">
      <span>Employee Management</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.isAuthenticated()">
        <button mat-button routerLink="/employees">
          <mat-icon>people</mat-icon>
          Employees
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          Logout
        </button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    button {
      margin-left: 8px;
    }
    mat-icon {
      margin-right: 4px;
    }
  `]
})
export class NavigationComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 
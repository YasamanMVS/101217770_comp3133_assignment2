import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  template: `
    <mat-toolbar color="primary">
      <span>Employee Management</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.isAuthenticated()">
        <button mat-button routerLink="/employees">Employees</button>
        <button mat-button routerLink="/employees/new">Add Employee</button>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class NavComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}

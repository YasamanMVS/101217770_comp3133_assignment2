import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { GraphQLService } from '../../core/services/graphql.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error = '';
  displayedColumns: string[] = ['profilePic', 'firstName', 'lastName', 'email', 'department', 'position', 'actions'];
  private readonly defaultAvatar = 'assets/default-avatar.png';

  constructor(
    private graphqlService: GraphQLService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  private fetchEmployees(): void {
    this.loading = true;
    this.graphqlService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Error loading employees';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }

  getProfilePicUrl(profilePic: string | null): string {
    if (!profilePic) {
      return this.defaultAvatar;
    }
    
    // If the URL is already absolute (starts with http:// or https://)
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
      return profilePic;
    }
    
    // If it's a relative URL (starts with /uploads/)
    if (profilePic.startsWith('/uploads/')) {
      return `${environment.apiUrl}${profilePic}`;
    }
    
    // If it's just the filename
    if (!profilePic.startsWith('/')) {
      return `${environment.apiUrl}/uploads/${profilePic}`;
    }
    
    return profilePic;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultAvatar;
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  onView(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  onEdit(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'edit']);
  }

  onDelete(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.graphqlService.deleteEmployee(employee.id).subscribe({
          next: () => {
            this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
            this.fetchEmployees();
          },
          error: (error: Error) => {
            this.snackBar.open('Error deleting employee', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}

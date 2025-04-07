import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { GraphQLService } from '../../core/services/graphql.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatDividerModule
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;
  error = '';
  employeeId: string | null = null;
  private readonly defaultAvatar = 'assets/default-avatar.png';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private graphqlService: GraphQLService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = id;
      this.fetchEmployee(id);
    } else {
      this.router.navigate(['/employees']);
    }
  }

  private fetchEmployee(id: string): void {
    this.loading = true;
    this.graphqlService.getEmployee(id).subscribe({
      next: (employee: Employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Error loading employee details';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
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

  onBack(): void {
    this.router.navigate(['/employees']);
  }

  onEdit(): void {
    if (this.employee) {
      this.router.navigate(['/employees', this.employee.id, 'edit']);
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  template: `
    <div class="employee-list-container">
      <div class="header">
        <h1>Employees</h1>
        <button mat-raised-button color="primary" routerLink="/employees/new">
          <mat-icon>add</mat-icon>
          Add Employee
        </button>
      </div>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search Employees</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Search by name, position, or department" #input>
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="mat-elevation-z8">
        <mat-table [dataSource]="dataSource" matSort>
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header> Name </mat-header-cell>
            <mat-cell *matCellDef="let employee"> {{employee.firstName}} {{employee.lastName}} </mat-cell>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <mat-header-cell *matHeaderCellDef mat-sort-header> Email </mat-header-cell>
            <mat-cell *matCellDef="let employee"> {{employee.email}} </mat-cell>
          </ng-container>

          <!-- Position Column -->
          <ng-container matColumnDef="position">
            <mat-header-cell *matHeaderCellDef mat-sort-header> Position </mat-header-cell>
            <mat-cell *matCellDef="let employee"> {{employee.position}} </mat-cell>
          </ng-container>

          <!-- Department Column -->
          <ng-container matColumnDef="department">
            <mat-header-cell *matHeaderCellDef mat-sort-header> Department </mat-header-cell>
            <mat-cell *matCellDef="let employee"> {{employee.department}} </mat-cell>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
            <mat-cell *matCellDef="let employee">
              <button mat-icon-button [routerLink]="['/employees', employee.id]" matTooltip="View Details">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button [routerLink]="['/employees/edit', employee.id]" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteEmployee(employee)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>

          <!-- Row shown when there is no matching data -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5">No data matching the filter "{{input.value}}"</td>
          </tr>
        </mat-table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of employees"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .employee-list-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }
    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'position', 'department', 'actions'];
  dataSource: MatTableDataSource<Employee>;
  isLoading = true;
  private filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Employee>([]);
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.dataSource = new MatTableDataSource<Employee>(employees);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.filterValue) {
          this.dataSource.filter = this.filterValue;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.snackBar.open('Error loading employees', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    
    if (this.dataSource) {
      this.dataSource.filter = this.filterValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: () => {
            this.loadEmployees();
            this.snackBar.open('Employee deleted successfully', 'Close', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Error deleting employee: ' + error.message, 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  openEmployeeForm(employee?: any): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '500px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }
}

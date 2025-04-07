import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, map, tap, catchError, throwError, switchMap } from 'rxjs';
import { Employee } from '../models/employee.model';
import { AuthService } from './auth.service';
import { FetchResult } from '@apollo/client/core';

interface EmployeesResponse {
  employees: Employee[];
}

interface EmployeeResponse {
  employee: Employee;
}

interface CreateEmployeeResponse {
  createEmployee: Employee;
}

interface UpdateEmployeeResponse {
  updateEmployee: Employee;
}

interface DeleteEmployeeResponse {
  deleteEmployee: boolean;
}

const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      firstName
      lastName
      email
      department
      position
      profilePic
    }
  }
`;

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      firstName
      lastName
      email
      department
      position
      profilePic
    }
  }
`;

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $firstName: String!
    $lastName: String!
    $email: String!
    $department: String!
    $position: String!
    $profilePic: String
  ) {
    createEmployee(
      firstName: $firstName
      lastName: $lastName
      email: $email
      department: $department
      position: $position
      profilePic: $profilePic
    ) {
      id
      firstName
      lastName
      email
      department
      position
      profilePic
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $email: String!
    $department: String!
    $position: String!
    $profilePic: String
  ) {
    updateEmployee(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      department: $department
      position: $position
      profilePic: $profilePic
    ) {
      id
      firstName
      lastName
      email
      department
      position
      profilePic
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:4000';

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getFullUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `${this.apiUrl}${path}`;
  }

  private uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData, { headers }).pipe(
      map(response => {
        if (!response || !response.url) {
          throw new Error('Invalid response from server');
        }
        return response.url;
      }),
      catchError(error => {
        console.error('Error uploading file:', error);
        if (error.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (error.status === 404) {
          throw new Error('Upload endpoint not found. Please check server configuration');
        } else if (error.error && error.error.message) {
          throw new Error(`Upload failed: ${error.error.message}`);
        } else {
          throw new Error('Failed to upload file: ' + (error.message || 'Unknown error'));
        }
      })
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.apollo.watchQuery<EmployeesResponse>({
      query: GET_EMPLOYEES,
      fetchPolicy: 'cache-and-network'
    }).valueChanges.pipe(
      map(result => result.data.employees.map(employee => ({
        ...employee,
        profilePic: employee.profilePic ? this.getFullUrl(employee.profilePic) : undefined
      }))),
      catchError(error => {
        console.error('Error fetching employees:', error);
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  getEmployee(id: string): Observable<Employee> {
    return this.apollo.watchQuery<EmployeeResponse>({
      query: GET_EMPLOYEE,
      variables: { id },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => ({
        ...result.data.employee,
        profilePic: result.data.employee.profilePic ? this.getFullUrl(result.data.employee.profilePic) : undefined
      }))
    );
  }

  createEmployee(employeeData: any): Observable<Employee> {
    // Extract the file and form data
    const { profilePic, ...rest } = employeeData;

    // If there's a file to upload, do that first
    if (profilePic instanceof File) {
      return this.uploadFile(profilePic).pipe(
        map(url => ({ ...rest, profilePic: url })),
        switchMap(data => this.apollo.mutate<{ createEmployee: Employee }>({
          mutation: CREATE_EMPLOYEE,
          variables: data,
          update: (cache, { data }) => {
            if (!data) return;
            
            // Read the current employees from cache
            const existingData = cache.readQuery<EmployeesResponse>({
              query: GET_EMPLOYEES
            });

            if (existingData) {
              // Write back to the cache with the new employee
              cache.writeQuery({
                query: GET_EMPLOYEES,
                data: {
                  employees: [...existingData.employees, data.createEmployee]
                }
              });
            }
          }
        })),
        map((result: FetchResult<{ createEmployee: Employee }>) => {
          if (!result.data) {
            throw new Error('No data returned from mutation');
          }
          const employee = result.data.createEmployee;
          return {
            ...employee,
            profilePic: employee.profilePic ? this.getFullUrl(employee.profilePic) : undefined
          };
        }),
        catchError(error => {
          console.error('Error creating employee:', error);
          throw this.handleError(error);
        })
      );
    }

    // If no file to upload, just create the employee
    return this.apollo.mutate<{ createEmployee: Employee }>({
      mutation: CREATE_EMPLOYEE,
      variables: employeeData,
      update: (cache, { data }) => {
        if (!data) return;
        
        // Read the current employees from cache
        const existingData = cache.readQuery<EmployeesResponse>({
          query: GET_EMPLOYEES
        });

        if (existingData) {
          // Write back to the cache with the new employee
          cache.writeQuery({
            query: GET_EMPLOYEES,
            data: {
              employees: [...existingData.employees, data.createEmployee]
            }
          });
        }
      }
    }).pipe(
      map((result: FetchResult<{ createEmployee: Employee }>) => {
        if (!result.data) {
          throw new Error('No data returned from mutation');
        }
        const employee = result.data.createEmployee;
        return {
          ...employee,
          profilePic: employee.profilePic ? this.getFullUrl(employee.profilePic) : undefined
        };
      }),
      catchError(error => {
        console.error('Error creating employee:', error);
        throw this.handleError(error);
      })
    );
  }

  updateEmployee(id: string, employeeData: any): Observable<Employee> {
    // Extract the file and form data
    const { profilePic, ...rest } = employeeData;

    // If there's a file to upload, do that first
    if (profilePic instanceof File) {
      return this.uploadFile(profilePic).pipe(
        map(url => ({ id, ...rest, profilePic: url })),
        switchMap(data => this.apollo.mutate<{ updateEmployee: Employee }>({
          mutation: UPDATE_EMPLOYEE,
          variables: data,
          refetchQueries: [{ query: GET_EMPLOYEES }]
        })),
        map((result: FetchResult<{ updateEmployee: Employee }>) => {
          if (!result.data) {
            throw new Error('No data returned from mutation');
          }
          const employee = result.data.updateEmployee;
          return {
            ...employee,
            profilePic: employee.profilePic ? this.getFullUrl(employee.profilePic) : undefined
          };
        }),
        catchError(error => {
          console.error('Error updating employee:', error);
          throw this.handleError(error);
        })
      );
    }

    // If no file to upload, just update the employee
    return this.apollo.mutate<{ updateEmployee: Employee }>({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, ...employeeData },
      refetchQueries: [{ query: GET_EMPLOYEES }]
    }).pipe(
      map((result: FetchResult<{ updateEmployee: Employee }>) => {
        if (!result.data) {
          throw new Error('No data returned from mutation');
        }
        const employee = result.data.updateEmployee;
        return {
          ...employee,
          profilePic: employee.profilePic ? this.getFullUrl(employee.profilePic) : undefined
        };
      }),
      catchError(error => {
        console.error('Error updating employee:', error);
        throw this.handleError(error);
      })
    );
  }

  deleteEmployee(id: string): Observable<boolean> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.apollo.mutate<DeleteEmployeeResponse>({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      context: {
        headers
      }
    }).pipe(
      map(result => result.data!.deleteEmployee),
      tap(() => this.apollo.client.resetStore()),
      catchError(error => {
        console.error('Error deleting employee:', error);
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  private handleError(error: any): Error {
    if (error.message) {
      return new Error(error.message);
    }
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return new Error(error.graphQLErrors[0].message);
    }
    if (error.networkError) {
      return new Error('Network error. Please check your connection.');
    }
    return new Error('An unknown error occurred. Please try again.');
  }

  private getErrorMessage(error: any): string {
    if (error.message) {
      return error.message;
    }
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }
    if (error.networkError) {
      return 'Network error. Please check your connection.';
    }
    return 'An unknown error occurred. Please try again.';
  }
}

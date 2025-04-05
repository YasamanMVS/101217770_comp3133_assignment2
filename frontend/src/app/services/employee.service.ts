import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      firstName
      lastName
      email
      position
      department
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
      position
      department
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
  ) {
    createEmployee(
      firstName: $firstName
      lastName: $lastName
      email: $email
      department: $department
      position: $position
    ) {
      id
      firstName
      lastName
      email
      position
      department
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $department: String
    $position: String
  ) {
    updateEmployee(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      department: $department
      position: $position
    ) {
      id
      firstName
      lastName
      email
      position
      department
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
  constructor(private apollo: Apollo) {}

  getEmployees(): Observable<Employee[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_EMPLOYEES
      })
      .valueChanges.pipe(map(result => result.data.employees));
  }

  getEmployee(id: string): Observable<Employee> {
    return this.apollo
      .watchQuery<any>({
        query: GET_EMPLOYEE,
        variables: { id }
      })
      .valueChanges.pipe(map(result => result.data.employee));
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.apollo
      .mutate<any>({
        mutation: CREATE_EMPLOYEE,
        variables: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          department: employee.department,
          position: employee.position
        },
        refetchQueries: [{ query: GET_EMPLOYEES }]
      })
      .pipe(map(result => result.data.createEmployee));
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.apollo
      .mutate<any>({
        mutation: UPDATE_EMPLOYEE,
        variables: {
          id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          department: employee.department,
          position: employee.position
        },
        refetchQueries: [{ query: GET_EMPLOYEES }]
      })
      .pipe(map(result => result.data.updateEmployee));
  }

  deleteEmployee(id: string): Observable<boolean> {
    return this.apollo
      .mutate<any>({
        mutation: DELETE_EMPLOYEE,
        variables: { id },
        refetchQueries: [{ query: GET_EMPLOYEES }]
      })
      .pipe(map(result => result.data.deleteEmployee));
  }
}

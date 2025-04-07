import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee, EmployeeInput } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}

  // Employee Queries
  getEmployees(): Observable<Employee[]> {
    return this.apollo
      .watchQuery({
        query: gql`
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
        `
      })
      .valueChanges.pipe(map((result: any) => result.data.employees));
  }

  getEmployee(id: string): Observable<Employee> {
    return this.apollo
      .watchQuery({
        query: gql`
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
        `,
        variables: { id }
      })
      .valueChanges.pipe(map((result: any) => result.data.employee));
  }

  // Employee Mutations
  createEmployee(employee: EmployeeInput): Observable<Employee> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation CreateEmployee($input: EmployeeInput!) {
            createEmployee(input: $input) {
              id
              firstName
              lastName
              email
              department
              position
              profilePic
            }
          }
        `,
        variables: { input: employee }
      })
      .pipe(map((result: any) => result.data.createEmployee));
  }

  updateEmployee(id: string, employee: EmployeeInput): Observable<Employee> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
            updateEmployee(id: $id, input: $input) {
              id
              firstName
              lastName
              email
              department
              position
              profilePic
            }
          }
        `,
        variables: { id, input: employee }
      })
      .pipe(map((result: any) => result.data.updateEmployee));
  }

  deleteEmployee(id: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation DeleteEmployee($id: ID!) {
            deleteEmployee(id: $id)
          }
        `,
        variables: { id }
      })
      .pipe(map((result: any) => result.data.deleteEmployee));
  }
} 
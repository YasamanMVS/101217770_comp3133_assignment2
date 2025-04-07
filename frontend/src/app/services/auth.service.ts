import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, map, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  login: {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private apollo: Apollo,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    
    // Clear Apollo cache before making the request
    this.apollo.client.resetStore();
    
    return this.apollo.mutate<LoginResponse>({
      mutation: LOGIN_MUTATION,
      variables: {
        email,
        password
      },
      fetchPolicy: 'no-cache' // Disable caching for this request
    }).pipe(
      map(result => {
        if (result.data?.login) {
          return result.data.login;
        }
        throw new Error('Login failed: Invalid response');
      }),
      tap(data => {
        if (data?.token) {
          localStorage.setItem(this.TOKEN_KEY, data.token);
          this.isAuthenticatedSubject.next(true);
          this.router.navigate(['/employees']);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(this.getErrorMessage(error)));
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.apollo.client.resetStore();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getLoadingStatus(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  private getErrorMessage(error: any): string {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }
    if (error.networkError) {
      return 'Network error. Please check your connection.';
    }
    return 'An unexpected error occurred. Please try again.';
  }
}

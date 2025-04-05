import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  login: {
    token: string;
    user: {
      id: string;
      username: string;
      role: string;
    };
  };
}

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
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

  constructor(
    private apollo: Apollo,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.apollo.mutate<LoginResponse>({
      mutation: LOGIN_MUTATION,
      variables: {
        username,
        password
      }
    }).pipe(
      map(result => result.data?.login),
      tap(data => {
        if (data?.token) {
          localStorage.setItem(this.TOKEN_KEY, data.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
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
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavigationComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent],
  template: `
    <app-navigation></app-navigation>
    <div class="content-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .content-container {
      padding-top: 64px; /* Height of the toolbar */
      padding: 84px 20px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'Employee Management';
}

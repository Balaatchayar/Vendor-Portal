import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <span class="logo" routerLink="/">Vendor Portal</span>
      
      <div class="spacer"></div>
      
      <div *ngIf="isAuthenticated$ | async" class="nav-links">
        <button mat-button routerLink="/dashboard" routerLinkActive="active">
          <mat-icon>dashboard</mat-icon>
          Dashboard
        </button>
        <button mat-button routerLink="/financial-sheet" routerLinkActive="active">
          <mat-icon>account_balance</mat-icon>
          Financial
        </button>
        <button mat-button routerLink="/profile" routerLinkActive="active">
          <mat-icon>person</mat-icon>
          Profile
        </button>
        
        <button mat-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
          Menu
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-menu>
      </div>
      
      <div *ngIf="!(isAuthenticated$ | async)" class="auth-buttons">
        <button mat-button routerLink="/login">Login</button>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .nav-links {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .nav-links button {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .nav-links button.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    @media (max-width: 768px) {
      .nav-links button span {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
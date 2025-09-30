import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1>Welcome to Vendor Portal</h1>
          <p class="hero-subtitle">
            Access your data securely - view invoices, purchase orders, and financial information
          </p>
          <div class="cta-section">
            <button mat-raised-button color="primary" size="large" routerLink="/login">
              <mat-icon>login</mat-icon>
              Login to Portal
            </button>
          </div>
        </div>
      </div>
      
      <div class="features-section">
        <div class="container">
          <h2>Portal Features</h2>
          <div class="features-grid">
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon color="primary">dashboard</mat-icon>
                <h3>Dashboard</h3>
                <p>View purchase orders, goods receipts, and RFQs in one centralized location</p>
              </mat-card-content>
            </mat-card>
            
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon color="primary">account_balance</mat-icon>
                <h3>Financial Data</h3>
                <p>Access invoices, credit/debit memos, and aging details with real-time data</p>
              </mat-card-content>
            </mat-card>
            
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon color="primary">security</mat-icon>
                <h3>Secure Access</h3>
                <p>Enterprise-grade security with SAP integration via secure middleware</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 64px);
    }
    
    .hero-section {
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      color: white;
      padding: 120px 0;
      text-align: center;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 300;
      margin-bottom: 24px;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 48px;
      opacity: 0.9;
      line-height: 1.6;
    }
    
    .cta-section button {
      padding: 16px 32px;
      font-size: 1.1rem;
      gap: 8px;
    }
    
    .features-section {
      padding: 80px 0;
      background-color: #f5f5f5;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    .features-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 48px;
      color: #333;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }
    
    .feature-card {
      text-align: center;
      transition: transform 0.2s;
    }
    
    .feature-card:hover {
      transform: translateY(-4px);
    }
    
    .feature-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    
    .feature-card h3 {
      margin: 16px 0;
      color: #333;
    }
    
    .feature-card p {
      color: #666;
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
      }
      
      .features-section h2 {
        font-size: 2rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendorService } from '../../services/vendor.service';
import { AuthService } from '../../services/auth.service';
import { VendorProfile } from '../../models/vendor.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-container">
      <div class="container">
        <h1>Vendor Profile</h1>
        
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading profile...</p>
        </div>
        
        <mat-card *ngIf="!isLoading && profile" class="profile-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>business</mat-icon>
              {{ profile.name }}
            </mat-card-title>
            <mat-card-subtitle>Vendor ID: {{ profile.vendorId }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="profile-grid">
              <div class="profile-item">
                <mat-icon>location_city</mat-icon>
                <div>
                  <strong>Street Address</strong>
                  <p>{{ profile.street || 'Not provided' }}</p>
                </div>
              </div>
              
              <div class="profile-item">
                <mat-icon>location_on</mat-icon>
                <div>
                  <strong>City</strong>
                  <p>{{ profile.city || 'Not provided' }}</p>
                </div>
              </div>
              
              <div class="profile-item">
                <mat-icon>mail</mat-icon>
                <div>
                  <strong>Postal Code</strong>
                  <p>{{ profile.postcode || 'Not provided' }}</p>
                </div>
              </div>
              
              <div class="profile-item">
                <mat-icon>flag</mat-icon>
                <div>
                  <strong>Country</strong>
                  <p>{{ profile.country || 'Not provided' }}</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <div *ngIf="!isLoading && !profile" class="no-data">
          <mat-icon>error_outline</mat-icon>
          <p>Unable to load profile information</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
      padding: 24px 0;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 32px;
      text-align: center;
    }
    
    .loading-container {
      text-align: center;
      padding: 48px;
    }
    
    .loading-container p {
      margin-top: 16px;
      color: #666;
    }
    
    .profile-card {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .profile-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }
    
    .profile-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
    
    .profile-item mat-icon {
      color: #1976d2;
      margin-top: 4px;
    }
    
    .profile-item strong {
      display: block;
      color: #333;
      margin-bottom: 4px;
    }
    
    .profile-item p {
      margin: 0;
      color: #666;
    }
    
    .no-data {
      text-align: center;
      padding: 48px;
      color: #666;
    }
    
    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    
    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: VendorProfile | null = null;
  isLoading = true;

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    const vendorId = this.authService.getVendorId();
    if (!vendorId) return;

    this.vendorService.getProfile(vendorId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load profile', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
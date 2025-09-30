import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendorService } from '../../services/vendor.service';
import { AuthService } from '../../services/auth.service';
import { PurchaseOrder, GoodsReceipt, RFQ } from '../../models/vendor.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="container">
        <h1>Dashboard</h1>
        
        <mat-tab-group class="dashboard-tabs">
          <mat-tab label="Purchase Orders">
            <div class="tab-content">
              <div class="search-section">
                <mat-form-field appearance="outline">
                  <mat-label>Search Purchase Orders</mat-label>
                  <input matInput [(ngModel)]="poSearchTerm" placeholder="Search by PO number or material">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div *ngIf="poLoading" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Loading purchase orders...</p>
              </div>
              
              <mat-card *ngIf="!poLoading && filteredPurchaseOrders.length > 0" class="data-card">
                <mat-card-content>
                  <div class="table-container">
                    <table mat-table [dataSource]="filteredPurchaseOrders" class="data-table">
                      <ng-container matColumnDef="poNumber">
                        <th mat-header-cell *matHeaderCellDef>PO Number</th>
                        <td mat-cell *matCellDef="let po">{{ po.poNumber }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="material">
                        <th mat-header-cell *matHeaderCellDef>Material</th>
                        <td mat-cell *matCellDef="let po">{{ po.material }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="deliveryDate">
                        <th mat-header-cell *matHeaderCellDef>Delivery Date</th>
                        <td mat-cell *matCellDef="let po">{{ po.deliveryDate | date }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="docDate">
                        <th mat-header-cell *matHeaderCellDef>Doc Date</th>
                        <td mat-cell *matCellDef="let po">{{ po.docDate | date }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="unit">
                        <th mat-header-cell *matHeaderCellDef>Unit</th>
                        <td mat-cell *matCellDef="let po">{{ po.unit }}</td>
                      </ng-container>
                      
                      <tr mat-header-row *matHeaderRowDef="poColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: poColumns;"></tr>
                    </table>
                  </div>
                </mat-card-content>
              </mat-card>
              
              <div *ngIf="!poLoading && purchaseOrders.length === 0" class="no-data">
                <mat-icon>inbox</mat-icon>
                <p>No purchase orders found</p>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Goods Receipt">
            <div class="tab-content">
              <div class="search-section">
                <mat-form-field appearance="outline">
                  <mat-label>Search Goods Receipts</mat-label>
                  <input matInput [(ngModel)]="grSearchTerm" placeholder="Search by material or PO number">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div *ngIf="grLoading" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Loading goods receipts...</p>
              </div>
              
              <mat-card *ngIf="!grLoading && filteredGoodsReceipts.length > 0" class="data-card">
                <mat-card-content>
                  <div class="table-container">
                    <table mat-table [dataSource]="filteredGoodsReceipts" class="data-table">
                      <ng-container matColumnDef="materialDoc">
                        <th mat-header-cell *matHeaderCellDef>Material Doc</th>
                        <td mat-cell *matCellDef="let gr">{{ gr.materialDoc }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="poNumber">
                        <th mat-header-cell *matHeaderCellDef>PO Number</th>
                        <td mat-cell *matCellDef="let gr">{{ gr.poNumber }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="material">
                        <th mat-header-cell *matHeaderCellDef>Material</th>
                        <td mat-cell *matCellDef="let gr">{{ gr.material }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="quantity">
                        <th mat-header-cell *matHeaderCellDef>Quantity</th>
                        <td mat-cell *matCellDef="let gr">{{ gr.quantity }} {{ gr.unit }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="postDate">
                        <th mat-header-cell *matHeaderCellDef>Post Date</th>
                        <td mat-cell *matCellDef="let gr">{{ gr.postDate | date }}</td>
                      </ng-container>
                      
                      <tr mat-header-row *matHeaderRowDef="grColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: grColumns;"></tr>
                    </table>
                  </div>
                </mat-card-content>
              </mat-card>
              
              <div *ngIf="!grLoading && goodsReceipts.length === 0" class="no-data">
                <mat-icon>inbox</mat-icon>
                <p>No goods receipts found</p>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="RFQs">
            <div class="tab-content">
              <div class="search-section">
                <mat-form-field appearance="outline">
                  <mat-label>Search RFQs</mat-label>
                  <input matInput [(ngModel)]="rfqSearchTerm" placeholder="Search by RFQ number or material">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div *ngIf="rfqLoading" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Loading RFQs...</p>
              </div>
              
              <mat-card *ngIf="!rfqLoading && filteredRFQs.length > 0" class="data-card">
                <mat-card-content>
                  <div class="table-container">
                    <table mat-table [dataSource]="filteredRFQs" class="data-table">
                      <ng-container matColumnDef="rfqNumber">
                        <th mat-header-cell *matHeaderCellDef>RFQ Number</th>
                        <td mat-cell *matCellDef="let rfq">{{ rfq.rfqNumber }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="material">
                        <th mat-header-cell *matHeaderCellDef>Material</th>
                        <td mat-cell *matCellDef="let rfq">{{ rfq.material }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="description">
                        <th mat-header-cell *matHeaderCellDef>Description</th>
                        <td mat-cell *matCellDef="let rfq">{{ rfq.description }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="createdDate">
                        <th mat-header-cell *matHeaderCellDef>Created Date</th>
                        <td mat-cell *matCellDef="let rfq">{{ rfq.createdDate | date }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="targetDate">
                        <th mat-header-cell *matHeaderCellDef>Target Date</th>
                        <td mat-cell *matCellDef="let rfq">{{ rfq.targetDate | date }}</td>
                      </ng-container>
                      
                      <tr mat-header-row *matHeaderRowDef="rfqColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: rfqColumns;"></tr>
                    </table>
                  </div>
                </mat-card-content>
              </mat-card>
              
              <div *ngIf="!rfqLoading && rfqs.length === 0" class="no-data">
                <mat-icon>inbox</mat-icon>
                <p>No RFQs found</p>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
      padding: 24px 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 32px;
      text-align: center;
    }
    
    .dashboard-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .tab-content {
      padding: 24px;
    }
    
    .search-section {
      margin-bottom: 24px;
    }
    
    .search-section mat-form-field {
      width: 100%;
      max-width: 400px;
    }
    
    .loading-container {
      text-align: center;
      padding: 48px;
    }
    
    .loading-container p {
      margin-top: 16px;
      color: #666;
    }
    
    .data-card {
      margin-bottom: 24px;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      min-width: 600px;
    }
    
    .data-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    
    .data-table td, .data-table th {
      padding: 12px 8px;
      text-align: left;
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
      .container {
        padding: 0 16px;
      }
      
      .tab-content {
        padding: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  goodsReceipts: GoodsReceipt[] = [];
  rfqs: RFQ[] = [];
  
  poLoading = true;
  grLoading = true;
  rfqLoading = true;
  
  poSearchTerm = '';
  grSearchTerm = '';
  rfqSearchTerm = '';
  
  poColumns = ['poNumber', 'material', 'deliveryDate', 'docDate', 'unit'];
  grColumns = ['materialDoc', 'poNumber', 'material', 'quantity', 'postDate'];
  rfqColumns = ['rfqNumber', 'material', 'description', 'createdDate', 'targetDate'];

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  get filteredPurchaseOrders(): PurchaseOrder[] {
    if (!this.poSearchTerm) return this.purchaseOrders;
    const term = this.poSearchTerm.toLowerCase();
    return this.purchaseOrders.filter(po => 
      po.poNumber.toLowerCase().includes(term) || 
      po.material.toLowerCase().includes(term)
    );
  }

  get filteredGoodsReceipts(): GoodsReceipt[] {
    if (!this.grSearchTerm) return this.goodsReceipts;
    const term = this.grSearchTerm.toLowerCase();
    return this.goodsReceipts.filter(gr => 
      gr.material.toLowerCase().includes(term) || 
      gr.poNumber.toLowerCase().includes(term)
    );
  }

  get filteredRFQs(): RFQ[] {
    if (!this.rfqSearchTerm) return this.rfqs;
    const term = this.rfqSearchTerm.toLowerCase();
    return this.rfqs.filter(rfq => 
      rfq.rfqNumber.toLowerCase().includes(term) || 
      rfq.material.toLowerCase().includes(term) ||
      rfq.description.toLowerCase().includes(term)
    );
  }

  private loadDashboardData(): void {
    const vendorId = this.authService.getVendorId();
    if (!vendorId) return;

    // Load Purchase Orders
    this.vendorService.getPurchaseOrders(vendorId).subscribe({
      next: (data) => {
        this.purchaseOrders = data;
        this.poLoading = false;
      },
      error: (error) => {
        this.poLoading = false;
        this.snackBar.open('Failed to load purchase orders', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });

    // Load Goods Receipts
    this.vendorService.getGoodsReceipts(vendorId).subscribe({
      next: (data) => {
        this.goodsReceipts = data;
        this.grLoading = false;
      },
      error: (error) => {
        this.grLoading = false;
        this.snackBar.open('Failed to load goods receipts', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });

    // Load RFQs
    this.vendorService.getRFQs(vendorId).subscribe({
      next: (data) => {
        this.rfqs = data;
        this.rfqLoading = false;
      },
      error: (error) => {
        this.rfqLoading = false;
        this.snackBar.open('Failed to load RFQs', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
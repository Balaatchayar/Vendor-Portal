



import { HttpClient } from '@angular/common/http';

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
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { VendorService } from '../../services/vendor.service';
import { AuthService } from '../../services/auth.service';
import { Invoice, Memo, Aging } from '../../models/vendor.models';

@Component({
  selector: 'app-financial-sheet',
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
    MatProgressSpinnerModule,
    MatChipsModule,
    MatButtonModule
  ],
  template: `
    <div class="financial-container">
      <div class="container">
        <h1>Financial Sheet</h1>
        
        <mat-tab-group class="financial-tabs">
          <mat-tab label="Invoices">
            <div class="tab-content">
              <div class="search-section">
                <mat-form-field appearance="outline">
                  <mat-label>Search Invoices</mat-label>
                  <input matInput [(ngModel)]="invoiceSearchTerm" placeholder="Search by invoice number or PO">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div *ngIf="invoiceLoading" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Loading invoices...</p>
              </div>
              
              <mat-card *ngIf="!invoiceLoading && filteredInvoices.length > 0" class="data-card">
                <mat-card-content>
                  <div class="table-container">
                    <table mat-table [dataSource]="filteredInvoices" class="data-table">
                      <ng-container matColumnDef="invoiceNo">
                        <th mat-header-cell *matHeaderCellDef>Invoice No</th>
                        <td mat-cell *matCellDef="let invoice">{{ invoice.invoiceNo }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="invoiceDate">
                        <th mat-header-cell *matHeaderCellDef>Date</th>
                        <td mat-cell *matCellDef="let invoice">{{ invoice.invoiceDate | date }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="totalAmount">
                        <th mat-header-cell *matHeaderCellDef>Amount</th>
                        <td mat-cell *matCellDef="let invoice">
                          <span class="amount">{{ invoice.totalAmount | currency:invoice.currency }}</span>
                        </td>
                      </ng-container>
                      
                      <ng-container matColumnDef="poNo">
                        <th mat-header-cell *matHeaderCellDef>PO No</th>
                        <td mat-cell *matCellDef="let invoice">{{ invoice.poNo }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="description">
                        <th mat-header-cell *matHeaderCellDef>Description</th>
                        <td mat-cell *matCellDef="let invoice">{{ invoice.description }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="paymentTerms">
                        <th mat-header-cell *matHeaderCellDef></th>
                        <td mat-cell *matCellDef="let invoice">
                          
                        </td>
                      </ng-container>
                      
                      <ng-container matColumnDef="actions">
                        <th mat-header-cell *matHeaderCellDef>Actions</th>
                        <td mat-cell *matCellDef="let invoice">
                          <button mat-raised-button color="primary" 
                                  (click)="downloadInvoicePDF(invoice.invoiceNo)"

                                  class="download-btn">
                            <mat-icon>download</mat-icon>
                            Download PDF
                          </button>
                        </td>
                      </ng-container>
                      
                      <tr mat-header-row *matHeaderRowDef="invoiceColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: invoiceColumns;"></tr>
                    </table>
                  </div>
                </mat-card-content>
              </mat-card>
              
              <div *ngIf="!invoiceLoading && invoices.length === 0" class="no-data">
                <mat-icon>receipt</mat-icon>
                <p>No invoices found</p>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Credit/Debit Memos">
            <div class="tab-content">
              <div class="search-section">
                <mat-form-field appearance="outline">
                  <mat-label>Search Memos</mat-label>
                  <input matInput [(ngModel)]="memoSearchTerm" placeholder="Search by memo document or type">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div *ngIf="memoLoading" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Loading memos...</p>
              </div>
              
              <mat-card *ngIf="!memoLoading && filteredMemos.length > 0" class="data-card">
                <mat-card-content>
                  <div class="table-container">
                    <table mat-table [dataSource]="filteredMemos" class="data-table">
                      <ng-container matColumnDef="memoDoc">
                        <th mat-header-cell *matHeaderCellDef>Memo Doc</th>
                        <td mat-cell *matCellDef="let memo">{{ memo.memoDoc }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="memoType">
                        <th mat-header-cell *matHeaderCellDef>Type</th>
                        <td mat-cell *matCellDef="let memo">
                          <mat-chip [class]="getMemoTypeClass(memo.memoType)">
                            {{ memo.memoType }}
                          </mat-chip>
                        </td>
                      </ng-container>
                      
                      <ng-container matColumnDef="amount">
                        <th mat-header-cell *matHeaderCellDef>Amount</th>
                        <td mat-cell *matCellDef="let memo">
                          <span class="amount" [class]="getAmountClass(memo.amount)">
                            {{ memo.amount | currency:memo.currency }}
                          </span>
                        </td>
                      </ng-container>
                      
                      <ng-container matColumnDef="postingDate">
                        <th mat-header-cell *matHeaderCellDef>Posting Date</th>
                        <td mat-cell *matCellDef="let memo">{{ memo.postingDate | date }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="referenceDocNo">
                        <th mat-header-cell *matHeaderCellDef></th>
                        <td mat-cell *matCellDef="let memo"></td>
                      </ng-container>
                      
                      <ng-container matColumnDef="docType">
                        <th mat-header-cell *matHeaderCellDef>Doc Type</th>
                        <td mat-cell *matCellDef="let memo">{{ memo.docType }}</td>
                      </ng-container>
                      
                      <tr mat-header-row *matHeaderRowDef="memoColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: memoColumns;"></tr>
                    </table>
                  </div>
                </mat-card-content>
              </mat-card>
              
              <div *ngIf="!memoLoading && memos.length === 0" class="no-data">
                <mat-icon>note</mat-icon>
                <p>No memos found</p>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Aging Details">
            <div class="tab-content">
              <div class="search-section">
                <mat-form-field appearance="outline">
                  <mat-label>Search Aging</mat-label>
                  <input matInput [(ngModel)]="agingSearchTerm" placeholder="Search by payment document">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div *ngIf="agingLoading" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Loading aging details...</p>
              </div>
              
              <mat-card *ngIf="!agingLoading && filteredAging.length > 0" class="data-card">
                <mat-card-content>
                  <div class="table-container">
                    <table mat-table [dataSource]="filteredAging" class="data-table">
                      <ng-container matColumnDef="paymentDoc">
                        <th mat-header-cell *matHeaderCellDef>Payment Doc</th>
                        <td mat-cell *matCellDef="let aging">{{ aging.paymentDoc }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="amountPaid">
                        <th mat-header-cell *matHeaderCellDef>Amount Paid</th>
                        <td mat-cell *matCellDef="let aging">
                          <span class="amount positive">{{ aging.amountPaid | currency:aging.currency }}</span>
                        </td>
                      </ng-container>
                      
                      <ng-container matColumnDef="paymentDate">
                        <th mat-header-cell *matHeaderCellDef>Payment Date</th>
                        <td mat-cell *matCellDef="let aging">{{ aging.paymentDate | date }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="dueDate">
                        <th mat-header-cell *matHeaderCellDef>Due Date</th>
                        <td mat-cell *matCellDef="let aging">{{ aging.dueDate | date }}</td>
                      </ng-container>
                      
                      <ng-container matColumnDef="aging">
                        <th mat-header-cell *matHeaderCellDef>Aging (Days)</th>
                        <td mat-cell *matCellDef="let aging">
                          <mat-chip [class]="getAgingClass(aging.aging)">
                            {{ aging.aging }} days
                          </mat-chip>
                        </td>
                      </ng-container>
                      
                      <tr mat-header-row *matHeaderRowDef="agingColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: agingColumns;"></tr>
                    </table>
                  </div>
                </mat-card-content>
              </mat-card>
              
              <div *ngIf="!agingLoading && aging.length === 0" class="no-data">
                <mat-icon>schedule</mat-icon>
                <p>No aging details found</p>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .financial-container {
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
    
    .financial-tabs {
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
      min-width: 800px;
    }
    
    .data-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    
    .data-table td, .data-table th {
      padding: 12px 8px;
      text-align: left;
    }
    
    .amount {
      font-weight: 600;
    }
    
    .amount.positive {
      color: #4caf50;
    }
    
    .amount.negative {
      color: #f44336;
    }
    
    .credit-chip {
      background-color: #e8f5e8 !important;
      color: #2e7d32 !important;
    }
    
    .debit-chip {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }
    
    .aging-good {
      background-color: #e8f5e8 !important;
      color: #2e7d32 !important;
    }
    
    .aging-warning {
      background-color: #fff3e0 !important;
      color: #ef6c00 !important;
    }
    
    .aging-overdue {
      background-color: #ffebee !important;
      color: #c62828 !important;
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
    
    .download-btn {
      font-size: 12px;
      padding: 4px 8px;
      min-width: auto;
    }
    
    .download-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 16px;
      }
      
      .tab-content {
        padding: 16px;
      }
      
      .data-table {
        min-width: 600px;
      }
    }
  `]
  
})
export class FinancialSheetComponent implements OnInit {
  
  invoices: Invoice[] = [];
  memos: Memo[] = [];
  aging: Aging[] = [];
  
  invoiceLoading = true;
  memoLoading = true;
  agingLoading = true;
  
  invoiceSearchTerm = '';
  memoSearchTerm = '';
  agingSearchTerm = '';
  
  invoiceColumns = ['invoiceNo', 'invoiceDate', 'totalAmount', 'poNo', 'description', 'paymentTerms','actions'];
  memoColumns = ['memoDoc', 'memoType', 'amount', 'postingDate', 'referenceDocNo', 'docType'];
  agingColumns = ['paymentDoc', 'amountPaid', 'paymentDate', 'dueDate', 'aging'];

  constructor(
    private http: HttpClient,
    private vendorService: VendorService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFinancialData();
  }

  get filteredInvoices(): Invoice[] {
    if (!this.invoiceSearchTerm) return this.invoices;
    const term = this.invoiceSearchTerm.toLowerCase();
    return this.invoices.filter(invoice => 
      invoice.invoiceNo.toLowerCase().includes(term) || 
      invoice.poNo.toLowerCase().includes(term)
    );
  }

  get filteredMemos(): Memo[] {
    if (!this.memoSearchTerm) return this.memos;
    const term = this.memoSearchTerm.toLowerCase();
    return this.memos.filter(memo => 
      memo.memoDoc.toLowerCase().includes(term) || 
      memo.memoType.toLowerCase().includes(term)
    );
  }

  get filteredAging(): Aging[] {
    if (!this.agingSearchTerm) return this.aging;
    const term = this.agingSearchTerm.toLowerCase();
    return this.aging.filter(age => 
      age.paymentDoc.toLowerCase().includes(term)
    );
  }

  getMemoTypeClass(memoType: string): string {
    return memoType.toLowerCase().includes('credit') ? 'credit-chip' : 'debit-chip';
  }

  getAmountClass(amount: number): string {
    return amount >= 0 ? 'positive' : 'negative';
  }

  getAgingClass(days: number): string {
    if (days <= 30) return 'aging-good';
    if (days <= 60) return 'aging-warning';
    return 'aging-overdue';
  }

  downloadInvoicePDF(invoiceId: string): void {
  const url = `http://localhost:3000/invoice/${invoiceId}`;
  this.http.get(url, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const fileURL = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = `Invoice_${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(fileURL);
    },
    error: (err) => {
      this.snackBar.open('Failed to download PDF', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  });
}


  private loadFinancialData(): void {
    const vendorId = this.authService.getVendorId();
    if (!vendorId) return;

    // Load Invoices
    this.vendorService.getInvoices(vendorId).subscribe({
      next: (data) => {
        this.invoices = data;
        this.invoiceLoading = false;
      },
      error: (error) => {
        this.invoiceLoading = false;
        this.snackBar.open('Failed to load invoices', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });

    // Load Memos
    this.vendorService.getMemos(vendorId).subscribe({
      next: (data) => {
        this.memos = data;
        this.memoLoading = false;
      },
      error: (error) => {
        this.memoLoading = false;
        this.snackBar.open('Failed to load memos', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });

    // Load Aging
    this.vendorService.getAging(vendorId).subscribe({
      next: (data) => {
        this.aging = data;
        this.agingLoading = false;
      },
      error: (error) => {
        this.agingLoading = false;
        this.snackBar.open('Failed to load aging details', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
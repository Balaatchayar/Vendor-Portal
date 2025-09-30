import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  VendorProfile, 
  PurchaseOrder, 
  GoodsReceipt, 
  RFQ, 
  Invoice, 
  Memo, 
  Aging 
} from '../models/vendor.models';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  constructor(private http: HttpClient) {}

  getProfile(vendorId: string): Observable<VendorProfile> {
    return this.http.get<VendorProfile>(`${environment.apiUrl}/profile/${vendorId}`);
  }

  getPurchaseOrders(vendorId: string): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${environment.apiUrl}/purchase-orders/${vendorId}`);
  }

  getGoodsReceipts(vendorId: string): Observable<GoodsReceipt[]> {
    return this.http.get<GoodsReceipt[]>(`${environment.apiUrl}/goodsreceipt/${vendorId}`);
  }

  getRFQs(vendorId: string): Observable<RFQ[]> {
    return this.http.get<RFQ[]>(`${environment.apiUrl}/rfq/${vendorId}`);
  }

  getInvoices(vendorId: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${environment.apiUrl}/invoices/${vendorId}`);
  }

  getMemos(vendorId: string): Observable<Memo[]> {
    return this.http.get<Memo[]>(`${environment.apiUrl}/memos/${vendorId}`);
  }

  getAging(vendorId: string): Observable<Aging[]> {
    return this.http.get<Aging[]>(`${environment.apiUrl}/aging/${vendorId}`);
  }
}
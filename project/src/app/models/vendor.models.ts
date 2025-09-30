export interface LoginCredentials {
  lifnr: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface VendorProfile {
  vendorId: string;
  name: string;
  city: string;
  country: string;
  postcode: string;
  street: string;
}

export interface PurchaseOrder {
  vendorId: string;
  deliveryDate: string;
  docDate: string;
  material: string;
  unit: string;
  poNumber: string;
  itemNumber: string;
}

export interface GoodsReceipt {
  materialDoc: string;
  docYear: string;
  postDate: string;
  entryDate: string;
  poNumber: string;
  poItem: string;
  material: string;
  quantity: number;
  unit: string;
  vendorId: string;
}

export interface RFQ {
  rfqNumber: string;
  vendorId: string;
  createdDate: string;
  itemNumber: string;
  material: string;
  unit: string;
  description: string;
  targetDate: string;
}

export interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  poNo: string;
  poItem: string;
  materialNo: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export interface Memo {
  memoDoc: string;
  docYear: string;
  postingDate: string;
  entryDate: string;
  vendorId: string;
  memoType: string;
  amount: number;
  currency: string;
  referenceDocNo: string;
  docType: string;
  companyCode: string;
}

export interface Aging {
  paymentDoc: string;
  docYear: string;
  paymentDate: string;
  entryDate: string;
  vendorId: string;
  amountPaid: number;
  currency: string;
  dueDate: string;
  aging: number;
}
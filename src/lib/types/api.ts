export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface UserMembership {
  membershipId: string;
  token: string;
  organisationId: string;
  organisationName?: string;
  roleName?: string;
}

export interface UserProfileData {
  userId: string;
  firstName?: string;
  lastName?: string;
  memberships: UserMembership[];
}

export interface UserProfileResponse {
  data: UserProfileData;
}

export interface InvoiceListParams {
  sortBy?: string;
  ordering?: "ASCENDING" | "DESCENDING";
  pageNum?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
  status?: string;
  keyword?: string;
}

export interface InvoiceItem {
  itemReference?: string;
  description: string;
  quantity: number;
  rate: number;
  itemName: string;
  itemUOM?: string;
}

export interface InvoiceStatus {
  key: string;
  value: boolean;
}

export interface Invoice {
  invoiceId?: string;
  invoiceNumber: string;
  invoiceReference?: string;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  description?: string;
  status?: InvoiceStatus[] | string;
  totalAmount?: number;
  customer?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    contact?: {
      email: string;
      mobileNumber?: string;
    };
  };
  items?: InvoiceItem[];
  createdAt?: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  totalRecords: number;
  pageNum: number;
  pageSize: number;
}

export interface RawInvoiceListResponse {
  data: Invoice[];
  paging: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
  };
}

export interface CreateInvoicePayload {
  invoices: Array<{
    bankAccount: {
      bankId?: string;
      sortCode: string;
      accountNumber: string;
      accountName: string;
    };
    customer: {
      firstName: string;
      lastName: string;
      contact: {
        email: string;
        mobileNumber: string;
      };
      addresses: Array<{
        premise: string;
        countryCode: string;
        postcode: string;
        county: string;
        city: string;
        addressType: string;
      }>;
    };
    invoiceReference: string;
    invoiceNumber: string;
    currency: string;
    invoiceDate: string;
    dueDate: string;
    description: string;
    items: InvoiceItem[];
  }>;
}

export interface ApiError {
  message: string;
  status?: number;
}

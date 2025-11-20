export interface Customer {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerWithSales extends Customer {
  sales: Sale[];
}

export interface Sale {
  id: number;
  total_cents: number;
  created_at: string;
  products: SaleProduct[];
}

export interface SaleProduct {
  id: number;
  name: string;
  sale_price_cents: number;
  quantity: number;
}

export interface CreateCustomerDTO {
  name?: string;
  phone?: string;
  email?: string;
  instagram?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  phone?: string;
  email?: string;
  instagram?: string;
}

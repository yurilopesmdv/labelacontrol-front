export interface Sale {
  id: number;
  customer_id: number;
  payment_method_id: number;
  total_cents: number;
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    name: string | null;
  };
  products?: SaleProduct[];
}

export interface SaleProduct {
  id: number;
  name: string;
  sale_price_cents: number;
  quantity: number;
}

export interface CreateSaleDTO {
  customer_id: number;
  payment_method_id: number;
  products: {
    product_id: number;
    quantity: number;
  }[];
}

export interface PaymentMethod {
  id: number;
  name: string;
}

// Common payment methods
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 1, name: 'Dinheiro' },
  { id: 2, name: 'Cartão de Crédito' },
  { id: 3, name: 'Cartão de Débito' },
  { id: 4, name: 'PIX' },
  { id: 5, name: 'Transferência' },
];

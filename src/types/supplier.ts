export interface Supplier {
  id: number;
  name: string | null;
  cnpj: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierDTO {
  name?: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  instagram?: string;
}

export interface UpdateSupplierDTO {
  name?: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  instagram?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  cost_price_cents: number;
  sale_price_cents: number;
  stock_qty: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  cost_price_cents: number;
  sale_price_cents: number;
  stock_qty?: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  cost_price_cents?: number;
  sale_price_cents?: number;
  stock_qty?: number;
}

// Helper functions to parse description
export const parseDescription = (description: string | null): { size: string; color: string } => {
  if (!description) return { size: '', color: '' };

  // Format: "Tamanho: X | Cor: Y"
  const parts = description.split('|').map(p => p.trim());
  const size = parts[0]?.replace('Tamanho:', '').trim() || '';
  const color = parts[1]?.replace('Cor:', '').trim() || '';

  return { size, color };
};

export const buildDescription = (size: string, color: string): string => {
  const parts = [];
  if (size) parts.push(`Tamanho: ${size}`);
  if (color) parts.push(`Cor: ${color}`);
  return parts.join(' | ');
};

import api from './api';
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types/product';

const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async create(data: CreateProductDTO): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data;
  },

  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};

export default productService;

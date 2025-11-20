import api from './api';
import type { Sale, CreateSaleDTO } from '../types/sale';

const saleService = {
  async getAll(): Promise<Sale[]> {
    const response = await api.get('/sales');
    return response.data;
  },

  async getById(id: number): Promise<Sale> {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  async create(data: CreateSaleDTO): Promise<Sale> {
    const response = await api.post('/sales', data);
    return response.data;
  },
};

export default saleService;

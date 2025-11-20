import api from './api';
import type { Customer, CustomerWithSales, CreateCustomerDTO, UpdateCustomerDTO } from '../types/customer';

const customerService = {
  async getAll(): Promise<Customer[]> {
    const response = await api.get('/customers');
    return response.data;
  },

  async getById(id: number): Promise<CustomerWithSales> {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async create(data: CreateCustomerDTO): Promise<Customer> {
    const response = await api.post('/customers', data);
    return response.data;
  },

  async update(id: number, data: UpdateCustomerDTO): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};

export default customerService;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import supplierService from '../../services/suppliers';
import type { Supplier, CreateSupplierDTO } from '../../types/supplier';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier: Supplier | null;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, onSuccess, supplier }) => {
  const [formData, setFormData] = useState<CreateSupplierDTO>({
    name: '',
    cnpj: '',
    phone: '',
    email: '',
    instagram: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        cnpj: supplier.cnpj || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        instagram: supplier.instagram || '',
      });
    } else {
      setFormData({
        name: '',
        cnpj: '',
        phone: '',
        email: '',
        instagram: '',
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Digite um e-mail válido';
    }

    // Check if at least one field is filled
    const hasAnyField = formData.name || formData.cnpj || formData.phone || formData.email || formData.instagram;
    if (!hasAnyField) {
      toast.error('Preencha pelo menos um campo');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      // Remove empty fields
      const dataToSend: CreateSupplierDTO = {};
      if (formData.name) dataToSend.name = formData.name;
      if (formData.cnpj) dataToSend.cnpj = formData.cnpj;
      if (formData.phone) dataToSend.phone = formData.phone;
      if (formData.email) dataToSend.email = formData.email;
      if (formData.instagram) dataToSend.instagram = formData.instagram;

      if (supplier) {
        await supplierService.update(supplier.id, dataToSend);
        toast.success('Fornecedor atualizado com sucesso!');
      } else {
        await supplierService.create(dataToSend);
        toast.success('Fornecedor criado com sucesso!');
      }

      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        `Erro ao ${supplier ? 'atualizar' : 'criar'} fornecedor`;
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateSupplierDTO, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
    >
      <Form onSubmit={handleSubmit}>
        <Input
          label="Nome"
          placeholder="Digite o nome do fornecedor"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />

        <Input
          label="CNPJ"
          placeholder="Digite o CNPJ"
          value={formData.cnpj}
          onChange={(e) => handleChange('cnpj', e.target.value)}
          error={errors.cnpj}
        />

        <Input
          label="Telefone"
          placeholder="Digite o telefone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Digite o email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <Input
          label="Instagram"
          placeholder="Digite o Instagram (ex: @usuario)"
          value={formData.instagram}
          onChange={(e) => handleChange('instagram', e.target.value)}
          error={errors.instagram}
        />

        <ButtonGroup>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            {supplier ? 'Atualizar' : 'Criar'}
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export default SupplierModal;

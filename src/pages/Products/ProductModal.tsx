import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import productService from '../../services/products';
import type { Product, CreateProductDTO } from '../../types/product';
import { parseDescription, buildDescription } from '../../types/product';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    color: '',
    cost_price_cents: '',
    sale_price_cents: '',
    stock_qty: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      const { size, color } = parseDescription(product.description);
      setFormData({
        name: product.name || '',
        size,
        color,
        cost_price_cents: String(product.cost_price_cents / 100), // Convert cents to reais
        sale_price_cents: String(product.sale_price_cents / 100),
        stock_qty: String(product.stock_qty),
      });
    } else {
      setFormData({
        name: '',
        size: '',
        color: '',
        cost_price_cents: '',
        sale_price_cents: '',
        stock_qty: '0',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.cost_price_cents) {
      newErrors.cost_price_cents = 'Preço de custo é obrigatório';
    } else if (isNaN(Number(formData.cost_price_cents)) || Number(formData.cost_price_cents) < 0) {
      newErrors.cost_price_cents = 'Digite um valor válido';
    }

    if (!formData.sale_price_cents) {
      newErrors.sale_price_cents = 'Preço de venda é obrigatório';
    } else if (isNaN(Number(formData.sale_price_cents)) || Number(formData.sale_price_cents) < 0) {
      newErrors.sale_price_cents = 'Digite um valor válido';
    }

    if (formData.stock_qty && (isNaN(Number(formData.stock_qty)) || Number(formData.stock_qty) < 0)) {
      newErrors.stock_qty = 'Digite um valor válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const description = buildDescription(formData.size, formData.color);

      const dataToSend: CreateProductDTO = {
        name: formData.name,
        description: description || undefined,
        cost_price_cents: Math.round(Number(formData.cost_price_cents) * 100), // Convert to cents
        sale_price_cents: Math.round(Number(formData.sale_price_cents) * 100),
        stock_qty: Number(formData.stock_qty) || 0,
      };

      if (product) {
        await productService.update(product.id, dataToSend);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await productService.create(dataToSend);
        toast.success('Produto criado com sucesso!');
      }

      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        `Erro ao ${product ? 'atualizar' : 'criar'} produto`;
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar Produto' : 'Novo Produto'}
      width="700px"
    >
      <Form onSubmit={handleSubmit}>
        <Input
          label="Nome do Produto"
          placeholder="Digite o nome do produto"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />

        <Row>
          <Input
            label="Tamanho"
            placeholder="Ex: P, M, G, GG"
            value={formData.size}
            onChange={(e) => handleChange('size', e.target.value)}
            error={errors.size}
          />

          <Input
            label="Cor"
            placeholder="Ex: Azul, Vermelho"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            error={errors.color}
          />
        </Row>

        <Row>
          <Input
            label="Preço de Custo (R$)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.cost_price_cents}
            onChange={(e) => handleChange('cost_price_cents', e.target.value)}
            error={errors.cost_price_cents}
          />

          <Input
            label="Preço de Venda (R$)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.sale_price_cents}
            onChange={(e) => handleChange('sale_price_cents', e.target.value)}
            error={errors.sale_price_cents}
          />
        </Row>

        <Input
          label="Quantidade em Estoque"
          type="number"
          min="0"
          placeholder="0"
          value={formData.stock_qty}
          onChange={(e) => handleChange('stock_qty', e.target.value)}
          error={errors.stock_qty}
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
            {product ? 'Atualizar' : 'Criar'}
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export default ProductModal;

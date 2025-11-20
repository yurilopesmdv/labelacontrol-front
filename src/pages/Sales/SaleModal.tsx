import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import saleService from '../../services/sales';
import customerService from '../../services/customers';
import productService from '../../services/products';
import type { CreateSaleDTO } from '../../types/sale';
import { PAYMENT_METHODS } from '../../types/sale';
import type { Customer } from '../../types/customer';
import type { Product } from '../../types/product';
import { parseDescription } from '../../types/product';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background: var(--white);
  border: 2px solid ${props => props.hasError ? 'var(--error)' : 'var(--gray-100)'};
  border-radius: 8px;
  color: var(--gray-800);
  font-size: 16px;
  transition: border-color 0.2s;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: var(--gray-800);
  font-size: 14px;
  font-weight: 500;
  display: block;
`;

const ErrorMessage = styled.span`
  color: var(--error);
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const ProductsSection = styled.div`
  margin-top: 16px;
`;

const ProductSearch = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled(Input)``;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--white);
  border: 2px solid var(--gray-100);
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SearchResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid var(--gray-100);

  &:hover {
    background: rgba(255, 105, 180, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProductName = styled.div`
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const ProductInfo = styled.div`
  font-size: 12px;
  color: var(--gray-300);
`;

const SelectedProducts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--background);
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductItemName = styled.div`
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const ProductItemPrice = styled.div`
  font-size: 14px;
  color: var(--gray-300);
`;

const QuantityInput = styled.input`
  width: 80px;
  height: 40px;
  padding: 0 12px;
  border: 2px solid var(--gray-100);
  border-radius: 6px;
  text-align: center;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: var(--error);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(197, 48, 48, 0.1);
  }
`;

const TotalSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(90deg, var(--primary-light) 0%, var(--primary) 100%);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.span`
  color: var(--white);
  font-weight: 600;
  font-size: 16px;
`;

const TotalValue = styled.span`
  color: var(--white);
  font-weight: 700;
  font-size: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const SaleModal: React.FC<SaleModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    payment_method_id: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      loadProducts();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({ customer_id: '', payment_method_id: '' });
    setSelectedProducts([]);
    setSearchTerm('');
    setErrors({});
  };

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedProducts.some(sp => sp.product.id === p.id)
  );

  const handleAddProduct = (product: Product) => {
    setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
    setSearchTerm('');
    setShowResults(false);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(sp => sp.product.id !== productId));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts(selectedProducts.map(sp =>
      sp.product.id === productId ? { ...sp, quantity } : sp
    ));
  };

  const calculateTotal = (): number => {
    return selectedProducts.reduce((sum, sp) =>
      sum + (sp.product.sale_price_cents * sp.quantity), 0
    );
  };

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customer_id) {
      newErrors.customer_id = 'Selecione um cliente';
    }

    if (!formData.payment_method_id) {
      newErrors.payment_method_id = 'Selecione uma forma de pagamento';
    }

    if (selectedProducts.length === 0) {
      newErrors.products = 'Adicione pelo menos um produto';
      toast.error('Adicione pelo menos um produto à venda');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const dataToSend: CreateSaleDTO = {
        customer_id: Number(formData.customer_id),
        payment_method_id: Number(formData.payment_method_id),
        products: selectedProducts.map(sp => ({
          product_id: sp.product.id,
          quantity: sp.quantity,
        })),
      };

      await saleService.create(dataToSend);
      toast.success('Venda criada com sucesso!');
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar venda';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Venda"
      width="800px"
    >
      <Form onSubmit={handleSubmit}>
        <Row>
          <div>
            <Label>Cliente</Label>
            <Select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              hasError={!!errors.customer_id}
            >
              <option value="">Selecione um cliente</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name || `Cliente #${customer.id}`}
                </option>
              ))}
            </Select>
            {errors.customer_id && <ErrorMessage>{errors.customer_id}</ErrorMessage>}
          </div>

          <div>
            <Label>Forma de Pagamento</Label>
            <Select
              value={formData.payment_method_id}
              onChange={(e) => setFormData({ ...formData, payment_method_id: e.target.value })}
              hasError={!!errors.payment_method_id}
            >
              <option value="">Selecione</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </Select>
            {errors.payment_method_id && <ErrorMessage>{errors.payment_method_id}</ErrorMessage>}
          </div>
        </Row>

        <ProductsSection>
          <Label>Produtos</Label>
          <ProductSearch>
            <SearchInput
              placeholder="Buscar produto por nome..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
            />
            {showResults && searchTerm && filteredProducts.length > 0 && (
              <SearchResults>
                {filteredProducts.slice(0, 5).map(product => {
                  const { size, color } = parseDescription(product.description);
                  return (
                    <SearchResultItem
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                    >
                      <ProductName>{product.name}</ProductName>
                      <ProductInfo>
                        {size && `Tamanho: ${size}`} {size && color && '|'} {color && `Cor: ${color}`}
                        {' | '}
                        {formatCurrency(product.sale_price_cents)}
                        {' | '}
                        Estoque: {product.stock_qty}
                      </ProductInfo>
                    </SearchResultItem>
                  );
                })}
              </SearchResults>
            )}
          </ProductSearch>

          <SelectedProducts>
            {selectedProducts.map(sp => {
              const { size, color } = parseDescription(sp.product.description);
              return (
                <ProductItem key={sp.product.id}>
                  <ProductDetails>
                    <ProductItemName>{sp.product.name}</ProductItemName>
                    <ProductItemPrice>
                      {size && `${size}`} {size && color && '|'} {color && `${color}`}
                      {' | '}
                      {formatCurrency(sp.product.sale_price_cents)} x {sp.quantity} = {formatCurrency(sp.product.sale_price_cents * sp.quantity)}
                    </ProductItemPrice>
                  </ProductDetails>
                  <QuantityInput
                    type="number"
                    min="1"
                    max={sp.product.stock_qty}
                    value={sp.quantity}
                    onChange={(e) => handleQuantityChange(sp.product.id, Number(e.target.value))}
                  />
                  <RemoveButton onClick={() => handleRemoveProduct(sp.product.id)} type="button">
                    <FaTrash size={16} />
                  </RemoveButton>
                </ProductItem>
              );
            })}
          </SelectedProducts>

          {selectedProducts.length > 0 && (
            <TotalSection>
              <TotalLabel>Total da Venda:</TotalLabel>
              <TotalValue>{formatCurrency(calculateTotal())}</TotalValue>
            </TotalSection>
          )}
        </ProductsSection>

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
            Finalizar Venda
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export default SaleModal;

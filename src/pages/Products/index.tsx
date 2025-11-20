import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import productService from '../../services/products';
import type { Product } from '../../types/product';
import { parseDescription } from '../../types/product';
import ProductModal from './ProductModal.tsx';

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;

  h1 {
    color: var(--gray-800);
    margin: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--gray-300);
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    color: var(--primary);
    background: rgba(255, 105, 180, 0.1);
  }

  &.delete:hover {
    color: var(--error);
    background: rgba(197, 48, 48, 0.1);
  }
`;

const ConfirmContent = styled.div`
  p {
    margin: 0 0 24px 0;
    color: var(--gray-800);
  }
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const StockBadge = styled.span<{ low?: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.low ? 'rgba(197, 48, 48, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  color: ${props => props.low ? 'var(--error)' : '#4CAF50'};
`;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error: any) {
      toast.error('Erro ao carregar produtos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      await productService.delete(productToDelete.id);
      toast.success('Produto deletado com sucesso!');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao deletar produto';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    loadProducts();
  };

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
    },
    {
      key: 'size',
      label: 'Tamanho',
      render: (_: any, product: Product) => {
        const { size } = parseDescription(product.description);
        return size || '-';
      },
    },
    {
      key: 'color',
      label: 'Cor',
      render: (_: any, product: Product) => {
        const { color } = parseDescription(product.description);
        return color || '-';
      },
    },
    {
      key: 'cost_price_cents',
      label: 'Preço Custo',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'sale_price_cents',
      label: 'Preço Venda',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'stock_qty',
      label: 'Estoque',
      render: (value: number) => (
        <StockBadge low={value < 10}>
          {value} un.
        </StockBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, product: Product) => (
        <Actions>
          <ActionButton onClick={(e) => handleEdit(product, e)} title="Editar">
            <FaEdit size={16} />
          </ActionButton>
          <ActionButton
            className="delete"
            onClick={(e) => handleDeleteClick(product, e)}
            title="Deletar"
          >
            <FaTrash size={16} />
          </ActionButton>
        </Actions>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <h1>Produtos</h1>
        <Button onClick={handleNew}>
          <FaPlus style={{ marginRight: '8px' }} />
          Novo Produto
        </Button>
      </Header>

      <Table
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="Nenhum produto cadastrado"
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        product={selectedProduct}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        width="400px"
      >
        <ConfirmContent>
          <p>
            Tem certeza que deseja deletar o produto{' '}
            <strong>{productToDelete?.name}</strong>?
          </p>
          <ConfirmActions>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button onClick={handleDelete} isLoading={deleting}>
              Confirmar
            </Button>
          </ConfirmActions>
        </ConfirmContent>
      </Modal>
    </Container>
  );
};

export default Products;

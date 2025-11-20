import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaPlus, FaEye } from 'react-icons/fa';
import Table from '../../components/Table';
import Button from '../../components/Button';
import saleService from '../../services/sales';
import type { Sale } from '../../types/sale';
import { PAYMENT_METHODS } from '../../types/sale';
import SaleModal from './SaleModal.tsx';

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
`;

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const data = await saleService.getAll();
      setSales(data);
    } catch (error: any) {
      toast.error('Erro ao carregar vendas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    loadSales();
  };

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getPaymentMethodName = (id: number): string => {
    const method = PAYMENT_METHODS.find(m => m.id === id);
    return method?.name || '-';
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: number) => `#${value}`,
    },
    {
      key: 'customer',
      label: 'Cliente',
      render: (_: any, sale: Sale) => sale.customer?.name || '-',
    },
    {
      key: 'payment_method_id',
      label: 'Pagamento',
      render: (value: number) => getPaymentMethodName(value),
    },
    {
      key: 'total_cents',
      label: 'Total',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'created_at',
      label: 'Data',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: () => (
        <Actions>
          <ActionButton title="Visualizar">
            <FaEye size={16} />
          </ActionButton>
        </Actions>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <h1>Vendas</h1>
        <Button onClick={handleNew}>
          <FaPlus style={{ marginRight: '8px' }} />
          Nova Venda
        </Button>
      </Header>

      <Table
        columns={columns}
        data={sales}
        loading={loading}
        emptyMessage="Nenhuma venda registrada"
      />

      <SaleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </Container>
  );
};

export default Sales;

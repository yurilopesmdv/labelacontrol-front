import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import customerService from '../../services/customers';
import type { Customer } from '../../types/customer';
import CustomerModal from './CustomerModal.tsx';

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

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error: any) {
      toast.error('Erro ao carregar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleView = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleDeleteClick = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;

    try {
      setDeleting(true);
      await customerService.delete(customerToDelete.id);
      toast.success('Cliente deletado com sucesso!');
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
      loadCustomers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao deletar cliente';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    loadCustomers();
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
    },
    {
      key: 'phone',
      label: 'Telefone',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'instagram',
      label: 'Instagram',
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, customer: Customer) => (
        <Actions>
          <ActionButton onClick={() => handleView(customer)} title="Visualizar">
            <FaEye size={16} />
          </ActionButton>
          <ActionButton onClick={(e) => handleEdit(customer, e)} title="Editar">
            <FaEdit size={16} />
          </ActionButton>
          <ActionButton
            className="delete"
            onClick={(e) => handleDeleteClick(customer, e)}
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
        <h1>Clientes</h1>
        <Button onClick={handleNew}>
          <FaPlus style={{ marginRight: '8px' }} />
          Novo Cliente
        </Button>
      </Header>

      <Table
        columns={columns}
        data={customers}
        loading={loading}
        emptyMessage="Nenhum cliente cadastrado"
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        customer={selectedCustomer}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        width="400px"
      >
        <ConfirmContent>
          <p>
            Tem certeza que deseja deletar o cliente{' '}
            <strong>{customerToDelete?.name || 'sem nome'}</strong>?
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

export default Customers;

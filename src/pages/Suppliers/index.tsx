import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import supplierService from '../../services/suppliers';
import type { Supplier } from '../../types/supplier';
import SupplierModal from './SupplierModal.tsx';

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

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error: any) {
      toast.error('Erro ao carregar fornecedores');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;

    try {
      setDeleting(true);
      await supplierService.delete(supplierToDelete.id);
      toast.success('Fornecedor deletado com sucesso!');
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
      loadSuppliers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao deletar fornecedor';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
    loadSuppliers();
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
    },
    {
      key: 'cnpj',
      label: 'CNPJ',
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
      render: (_: any, supplier: Supplier) => (
        <Actions>
          <ActionButton onClick={(e) => handleEdit(supplier, e)} title="Editar">
            <FaEdit size={16} />
          </ActionButton>
          <ActionButton
            className="delete"
            onClick={(e) => handleDeleteClick(supplier, e)}
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
        <h1>Fornecedores</h1>
        <Button onClick={handleNew}>
          <FaPlus style={{ marginRight: '8px' }} />
          Novo Fornecedor
        </Button>
      </Header>

      <Table
        columns={columns}
        data={suppliers}
        loading={loading}
        emptyMessage="Nenhum fornecedor cadastrado"
      />

      <SupplierModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        supplier={selectedSupplier}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        width="400px"
      >
        <ConfirmContent>
          <p>
            Tem certeza que deseja deletar o fornecedor{' '}
            <strong>{supplierToDelete?.name || 'sem nome'}</strong>?
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

export default Suppliers;

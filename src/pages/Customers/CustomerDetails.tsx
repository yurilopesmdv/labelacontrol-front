import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEdit, FaShoppingCart, FaCalendar } from 'react-icons/fa';
import Card from '../../components/Card';
import Button from '../../components/Button';
import customerService from '../../services/customers';
import type { CustomerWithSales } from '../../types/customer';

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  h1 {
    color: var(--gray-800);
    margin: 0;
  }
`;

const BackButton = styled.button`
  background: var(--white);
  border: 2px solid var(--gray-100);
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--gray-800);

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-100);

  &:last-child {
    border-bottom: none;
  }

  label {
    font-size: 12px;
    color: var(--gray-300);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  span {
    font-size: 16px;
    color: var(--gray-800);
  }
`;

const SalesSection = styled.div`
  h2 {
    color: var(--gray-800);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const SaleCard = styled(Card)`
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SaleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--gray-100);
`;

const SaleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SaleId = styled.span`
  font-weight: 600;
  color: var(--primary);
`;

const SaleDate = styled.span`
  color: var(--gray-300);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SaleTotal = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--background);
  border-radius: 6px;
`;

const ProductName = styled.span`
  color: var(--gray-800);
  font-weight: 500;
`;

const ProductDetails = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  color: var(--gray-300);
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: var(--gray-300);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px;
  color: var(--gray-300);
`;

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerWithSales | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCustomer(Number(id));
    }
  }, [id]);

  const loadCustomer = async (customerId: number) => {
    try {
      setLoading(true);
      const data = await customerService.getById(customerId);
      setCustomer(data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar cliente';
      toast.error(errorMessage);
      console.error(error);
      navigate('/customers');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <Container>
        <LoadingState>Carregando...</LoadingState>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container>
        <EmptyState>Cliente não encontrado</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/customers')}>
            <FaArrowLeft size={20} />
          </BackButton>
          <h1>{customer.name || 'Cliente sem nome'}</h1>
        </HeaderLeft>
        <Button onClick={() => navigate('/customers')}>
          <FaEdit style={{ marginRight: '8px' }} />
          Editar
        </Button>
      </Header>

      <Grid>
        <Card title="Informações do Cliente">
          <InfoRow>
            <label>Nome</label>
            <span>{customer.name || '-'}</span>
          </InfoRow>
          <InfoRow>
            <label>Telefone</label>
            <span>{customer.phone || '-'}</span>
          </InfoRow>
          <InfoRow>
            <label>Email</label>
            <span>{customer.email || '-'}</span>
          </InfoRow>
          <InfoRow>
            <label>Instagram</label>
            <span>{customer.instagram || '-'}</span>
          </InfoRow>
        </Card>

        <SalesSection>
          <h2>
            <FaShoppingCart />
            Histórico de Vendas ({customer.sales?.length || 0})
          </h2>

          {!customer.sales || customer.sales.length === 0 ? (
            <EmptyState>Nenhuma venda registrada para este cliente</EmptyState>
          ) : (
            customer.sales.map((sale) => (
              <SaleCard key={sale.id}>
                <SaleHeader>
                  <SaleInfo>
                    <SaleId>Venda #{sale.id}</SaleId>
                    <SaleDate>
                      <FaCalendar />
                      {formatDate(sale.created_at)}
                    </SaleDate>
                  </SaleInfo>
                  <SaleTotal>{formatCurrency(sale.total_cents)}</SaleTotal>
                </SaleHeader>

                <ProductsList>
                  {sale.products.map((product) => (
                    <ProductItem key={product.id}>
                      <ProductName>{product.name}</ProductName>
                      <ProductDetails>
                        <span>Qtd: {product.quantity}</span>
                        <span>{formatCurrency(product.sale_price_cents)}</span>
                      </ProductDetails>
                    </ProductItem>
                  ))}
                </ProductsList>
              </SaleCard>
            ))
          )}
        </SalesSection>
      </Grid>
    </Container>
  );
};

export default CustomerDetails;

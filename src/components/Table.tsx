import React from 'react';
import styled from 'styled-components';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const Container = styled.div`
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: linear-gradient(90deg, var(--primary-light) 0%, var(--primary) 100%);
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  color: var(--white);
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr<{ clickable?: boolean }>`
  border-bottom: 1px solid var(--gray-100);
  transition: background 0.2s;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};

  &:hover {
    background: ${props => props.clickable ? 'rgba(255, 105, 180, 0.05)' : 'transparent'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px;
  color: var(--gray-800);
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  padding: 48px;
  text-align: center;
  color: var(--gray-300);
`;

const EmptyContainer = styled.div`
  padding: 48px;
  text-align: center;
  color: var(--gray-300);
`;

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado'
}) => {
  if (loading) {
    return (
      <Container>
        <LoadingContainer>Carregando...</LoadingContainer>
      </Container>
    );
  }

  if (data.length === 0) {
    return (
      <Container>
        <EmptyContainer>{emptyMessage}</EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      <StyledTable>
        <Thead>
          <tr>
            {columns.map(column => (
              <Th key={column.key}>{column.label}</Th>
            ))}
          </tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr
              key={row.id || index}
              clickable={!!onRowClick}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(column => (
                <Td key={column.key}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key] || '-'
                  }
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </StyledTable>
    </Container>
  );
};

export default Table;

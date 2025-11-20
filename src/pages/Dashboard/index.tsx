import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  h1 {
    color: var(--gray-800);
    margin-bottom: 16px;
  }

  p {
    color: var(--gray-300);
  }
`;

const Dashboard: React.FC = () => {
  return (
    <Container>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao LaBela Control! Esta página está em construção.</p>
    </Container>
  );
};

export default Dashboard;

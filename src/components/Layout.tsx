import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 32px;
  min-height: 100vh;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <Navbar />
      <Content>{children}</Content>
    </Container>
  );
};

export default Layout;

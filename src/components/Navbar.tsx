import React, { useContext } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHeart, FaUsers, FaTruck, FaBox, FaShoppingCart, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Container = styled.nav`
  width: 250px;
  height: 100vh;
  background: linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  margin-bottom: 48px;
  padding: 0 24px;
  
  svg {
    margin-right: 12px;
  }

  h1 {
    font-size: 24px;
    font-family: 'Outfit', sans-serif;
  }
`;

const NavLinks = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;

  svg {
    margin-right: 12px;
    font-size: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--white);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin: 0 16px;
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
  cursor: pointer;

  svg {
    margin-right: 12px;
    font-size: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const UserInfo = styled.div`
  padding: 16px 24px;
  margin: 0 16px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--white);

  p {
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
  }

  strong {
    font-size: 16px;
    display: block;
    margin-bottom: 4px;
  }
`;

const Navbar: React.FC = () => {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  return (
    <Container>
      <Logo>
        <FaHeart size={32} />
        <h1>LaBela</h1>
      </Logo>

      <NavLinks>
        <StyledNavLink to="/dashboard">
          <FaTachometerAlt />
          Dashboard
        </StyledNavLink>
        <StyledNavLink to="/customers">
          <FaUsers />
          Clientes
        </StyledNavLink>
        <StyledNavLink to="/suppliers">
          <FaTruck />
          Fornecedores
        </StyledNavLink>
        <StyledNavLink to="/products">
          <FaBox />
          Produtos
        </StyledNavLink>
        <StyledNavLink to="/sales">
          <FaShoppingCart />
          Vendas
        </StyledNavLink>
      </NavLinks>

      {user && (
        <UserInfo>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </UserInfo>
      )}

      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        Sair
      </LogoutButton>
    </Container>
  );
};

export default Navbar;

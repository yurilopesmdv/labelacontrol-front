import React, { type ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

const Container = styled.button<ButtonProps>`
  width: 100%;
  height: 50px;
  border: 0;
  border-radius: 8px;
  font-weight: 600;
  transition: filter 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.variant === 'primary' && css`
    background: var(--primary);
    color: var(--white);
  `}

  ${props => props.variant === 'secondary' && css`
    background: var(--white);
    color: var(--primary);
    border: 2px solid var(--primary);
  `}

  &:hover {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading, ...rest }) => {
  return (
    <Container variant={variant} disabled={isLoading} {...rest}>
      {isLoading ? 'Carregando...' : children}
    </Container>
  );
};

export default Button;

import React, { type InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;

  label {
    margin-bottom: 8px;
    color: var(--gray-800);
    font-size: 14px;
    font-weight: 500;
  }
`;

const StyledInput = styled.input<{ hasError: boolean }>`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background: var(--white);
  border: 2px solid ${props => props.hasError ? 'var(--error)' : 'var(--gray-100)'};
  border-radius: 8px;
  color: var(--gray-800);
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--primary);
  }
`;

const ErrorMessage = styled.span`
  color: var(--error);
  font-size: 12px;
  margin-top: 4px;
`;

const Input: React.FC<InputProps> = ({ label, error, ...rest }) => {
  return (
    <Container>
      {label && <label>{label}</label>}
      <StyledInput hasError={!!error} {...rest} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default Input;

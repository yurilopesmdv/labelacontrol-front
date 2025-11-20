import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  padding?: string;
}

const Container = styled.div<{ padding?: string }>`
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: ${props => props.padding || '24px'};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  color: var(--gray-800);
  font-size: 18px;
  font-weight: 600;
`;

const Card: React.FC<CardProps> = ({ children, title, padding }) => {
  return (
    <Container padding={padding}>
      {title && <Title>{title}</Title>}
      {children}
    </Container>
  );
};

export default Card;

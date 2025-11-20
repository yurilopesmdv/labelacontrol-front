import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { FaHeart } from 'react-icons/fa';

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

const Background = styled.div`
  flex: 1;
  background: url('https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center;
  background-size: cover;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(255, 105, 180, 0.3), rgba(199, 21, 133, 0.6));
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700px;
  background: var(--white);
  padding: 0 32px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 48px;
  color: var(--primary);
  
  svg {
    margin-right: 12px;
  }

  h1 {
    font-size: 32px;
    font-family: 'Outfit', sans-serif;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 360px;
  text-align: center;

  h2 {
    margin-bottom: 24px;
    color: var(--gray-800);
  }
`;

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  function validate() {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Digite um e-mail válido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      signIn(token, user);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Content>
        <LogoContainer>
          <FaHeart size={40} />
          <h1>LaBela Control</h1>
        </LogoContainer>

        <Form onSubmit={handleSubmit}>
          <h2>Faça seu login</h2>

          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            error={errors.email}
          />

          <Input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
          />

          <Button type="submit" isLoading={loading}>
            Entrar
          </Button>
        </Form>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;

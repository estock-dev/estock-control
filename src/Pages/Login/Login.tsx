import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../ReduxStore/hooks';
import { signIn } from '../../ReduxStore/Slices/authSlice';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(signIn(values)).unwrap();
      navigate('/home');
    } catch (error) {
      console.error("Erro de login: ", error);
      const errorMessage = error instanceof Error ? error.message : 'Um erro desconhecido ocorreu, contate seu desenvolvedor';
      setLoginError(errorMessage);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div style={{ background: "#53406b", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form
        form={form}
        name="login_form"
        onFinish={onFinish}
        style={{ maxWidth: 300 }}
        initialValues={{ remember: true }}
      >
        {loginError && <Alert message={loginError} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Insira o e-mail!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Insira a senha' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Senha"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <Button htmlType="button" onClick={onReset} style={{ width: '100%' }}>
            Resetar campos
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

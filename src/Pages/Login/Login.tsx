import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../ReduxStore/hooks'
import { signIn } from '../../ReduxStore/Slices/authSlice';
import { getAuth, getIdTokenResult } from 'firebase/auth';
import { Button } from 'antd';
type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await dispatch(signIn(data)).unwrap();
      const auth = getAuth();
      const user = auth.currentUser;
      console.log("User: ", user);
      if (user) {
        getIdTokenResult(user).then((idTokenResult) => {
          idTokenResult.claims.admin = true;
          const isAdmin = !!idTokenResult.claims.admin;
          console.log("Is Admin: ", isAdmin);
          if (isAdmin) {
            navigate('/home');
          } else {
            navigate('/login');
          }
        });
      }
    } catch (error) {
      console.error("Login error: ", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setLoginError(errorMessage);
    }
  };

  return (
    <div style={{ background: "#53406b", width: "100vw", height: "100vh", margin: 'auto', alignContent: "center" }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ background: "transparent", maxWidth: 300, margin: 'auto' }}>
        {loginError && <Alert severity="error">{loginError}</Alert>}
        <TextField
          label="E-mail"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('email', { required: 'Email is required' })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <TextField
          label="Senha"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          {...register('password', { required: 'Password is required' })}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />
        <Button
         onClick={handleSubmit(onSubmit)}
          style={{ margin: '8px 0', background: "#7A6D99" }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;

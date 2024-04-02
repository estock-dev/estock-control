import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../ReduxStore/hooks'
import { signIn } from '../../ReduxStore/Slices/authSlice';
import { getAuth, getIdTokenResult } from 'firebase/auth';

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
      // After successful login, check for admin claims
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        getIdTokenResult(user).then((idTokenResult) => {
          // Check if the user is an admin
          const isAdmin = !!idTokenResult.claims.admin;
          console.log("Is Admin: ", isAdmin); // You might want to do something with this info
          if (isAdmin) {
            // Navigate to an admin-specific page or dashboard if needed
            navigate('/admin');
          } else {
            // Navigate to a general page if not admin
            navigate('/');
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
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 300, margin: 'auto' }}>
      {loginError && <Alert severity="error">{loginError}</Alert>}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register('email', { required: 'Email is required' })}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        {...register('password', { required: 'Password is required' })}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{ margin: '8px 0' }}
      >
        Login
      </Button>
      {/* Consider implementing the logic for "Login with Google" */}

    </form>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch } from '../../ReduxStore/hooks'
import { authenticateUser } from '../../ReduxStore/Slices/authSlice'
import { Button } from '@mui/material';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = getAuth();
  const [verificationChecked, setVerificationChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed, user:', user);
      if (user?.emailVerified) {
        dispatch(authenticateUser());
        navigate('/');
      }
    });

    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      const user = auth.currentUser;
      if (user?.emailVerified) {
        clearInterval(interval);
        dispatch(authenticateUser());
        navigate('/');
      }
    }, 3000); // Check every 3 seconds

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [dispatch, navigate]);

  const handleCheckVerification = async () => {
    setVerificationChecked(true);
    const user = auth.currentUser;
    await user?.reload();
    if (user?.emailVerified) {
      dispatch(authenticateUser());
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Verify Your Email Address</h1>
      <p>Please check your email and click on the verification link to proceed. If you have already verified, please click the button below.</p>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckVerification}
        disabled={verificationChecked}
      >
        {verificationChecked ? 'Checking Verification...' : 'I have verified'}
      </Button>
    </div>
  );
};

export default VerifyEmail;

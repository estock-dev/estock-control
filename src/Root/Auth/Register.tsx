import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Accordion,
  Typography,
  Checkbox,
  TextField,
  Button,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase'


interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  keepUpdated: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const onSubmit = async (data: IFormInput) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Exclude confirmPassword and password from being sent to Firestore
      const { confirmPassword, password, ...userData } = data;
      
      // Use the UID as the document ID in Firestore and set the user data
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Prepare a serializable user object for Redux (if you have additional user details)
      // Commented out to not log in user automatically after registration
      // const newUserForRedux = {
      //   ...userData,
      //   uid: userCredential.user.uid
      // };
      
      // Dispatch the user data to Redux (assuming you have a setUser action)
      // dispatch(setUser(newUserForRedux)); // Comment this out if you're not logging in the user immediately
      
      // Navigate to the email verification page after successful registration
      navigate('/verify-email');
    } catch (error) {
      // Log the error message only, not the entire error object
      console.error("Error during registration: ", error instanceof Error ? error.message : error);
      
      // Optionally, dispatch an action to store the error message in Redux
      // dispatch(setRegistrationError(error.message));
    }
  };
  
  const validatePassword = (value: string) => {
    return value === watch('password') || "Passwords do not match";
  };

  const nameValidationPattern = /^[A-Za-z]+$/;

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 300, margin: 'auto' }}>
      <TextField
        {...register("firstName", {
          required: "First name is required",
          pattern: {
            value: nameValidationPattern,
            message: "First name must contain letters only"
          }
        })}
        label="First Name"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField
        {...register("lastName", {
          required: "Last name is required",
          pattern: {
            value: nameValidationPattern,
            message: "Last name must contain letters only"
          }
        })}
        label="Last Name"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
      <TextField
        {...register("email", { required: "Email is required" })}
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" }
        })}
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          validate: validatePassword
        })}
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Address</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            {...register("addressLine1")}
            label="Address Line 1"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("addressLine2")}
            label="Address Line 2"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("city")}
            label="City"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("state")}
            label="State/Province/Region"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("zipCode")}
            label="Zip/Postal Code"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("country")}
            label="Country"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </AccordionDetails>
      </Accordion>
      <FormControlLabel
        control={<Checkbox {...register("agreeTerms")} color="primary" />}
        label="I agree with the terms and conditions"
      />
      <FormControlLabel
        control={<Checkbox {...register("keepUpdated")} color="primary" />}
        label="Keep me updated with DSRPTV latest releases"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{ margin: '8px 0' }}
        disabled={!watch("agreeTerms")} // Disable button if terms are not agreed to
      >
        Register
      </Button>
    </form>
  );
};

export default Register;

import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { useNavigate } from 'react-router-dom';
import ProductSelector from '../ProductSelector/ProductSelector';

const validationSchema = yup.object({
  marca: yup.string().required('Brand is required'),
  modelo: yup.string().required('Model is required'),
  nome: yup.string().required('Name is required'),
  qtd: yup.number().positive('Quantity must be positive').required('Quantity is required'),
});

const AddProduct = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      marca: '',
      modelo: '',
      nome: '',
      qtd: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await addDoc(collection(db, "products"), {
          ...values,
          qtd: parseInt(values.qtd, 10),
        });
        setSubmitted(true);
      } catch (error) {
        console.error('Error adding product to Firestore: ', error);
      }
    },
  });

  if (submitted) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h3">Product successfully added!</Typography>
        <Box>
          <Button onClick={() => {
              formik.resetForm();
              setSubmitted(false);
            }} variant="contained">
            Add another product
          </Button>
          <Button onClick={() => navigate('/')} variant="contained" color="secondary">
            Go to home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ padding: 3, marginTop: 3, marginBottom: 3 }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Add a New Product
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <ProductSelector
            onSelectionChange={(brand, model, name) => {
              formik.setFieldValue('marca', brand ?? '');
              formik.setFieldValue('modelo', model ?? '');
              formik.setFieldValue('nome', name ?? '');
            }}
          />
          <TextField
            label="Quantity"
            name="qtd"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.qtd}
            error={formik.touched.qtd && Boolean(formik.errors.qtd)}
            helperText={formik.touched.qtd && formik.errors.qtd}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={!formik.isValid || formik.isSubmitting}>
              Add Product
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduct;

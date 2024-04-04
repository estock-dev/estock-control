import { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';

const AddProductSchema = Yup.object().shape({
  marca: Yup.string().required('Required'),
  modelo: Yup.string().required('Required'),
  nome: Yup.string().required('Required'),
  qtd: Yup.number().min(0, 'Quantity cannot be negative').required('Required'),
});

const AddProduct = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      marca: '',
      modelo: '',
      nome: '',
      qtd: 0,
    },
    validationSchema: AddProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setSubmitError(null);

      try {
        const docRef = await addDoc(collection(db, 'products'), {
          ...values,
          qtd: Number(values.qtd), // Ensure the quantity is stored as a number
        });

        console.log('Document written with ID: ', docRef.id);
        alert('Product added successfully');
        resetForm();
      } catch (error) {
        console.error('Error adding product: ', error);
        setSubmitError(error instanceof Error ? error.message : String(error));
      }

      setSubmitting(false);
    },
  });

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          fontSize: '24px',
          color: 'rgb(108, 108, 108)',
          letterSpacing: '0.00735em',
          textAlign: 'left',
          marginTop: '20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          paddingBottom: '8px',
          marginBottom: '32px',
        }}
      >
        Adicionar Produto
      </Typography>
      <Paper elevation={2} sx={{ padding: '24px', marginBottom: '24px' }}>
        {submitError && <Alert severity="error">{submitError}</Alert>}
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Marca"
            id="marca"
            name="marca"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.marca}
            error={formik.touched.marca && Boolean(formik.errors.marca)}
            helperText={formik.touched.marca && formik.errors.marca}
            margin="normal"
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            label="Modelo"
            id="modelo"
            name="modelo"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.modelo}
            error={formik.touched.modelo && Boolean(formik.errors.modelo)}
            helperText={formik.touched.modelo && formik.errors.modelo}
            margin="normal"
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            label="Nome"
            id="nome"
            name="nome"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.nome}
            error={formik.touched.nome && Boolean(formik.errors.nome)}
            helperText={formik.touched.nome && formik.errors.nome}
            margin="normal"
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            label="Quantidade"
            id="qtd"
            name="qtd"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.qtd}
            error={formik.touched.qtd && Boolean(formik.errors.qtd)}
            helperText={formik.touched.qtd && formik.errors.qtd}
            margin="normal"
            sx={{ marginBottom: '10px' }}
          />
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              marginTop: '20px',
            }}
          >
            Adicionar Produto
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProduct;

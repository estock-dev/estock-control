import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, Paper, Alert, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Autocomplete } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../ReduxStore/hooks';
import { fetchProducts, fetchModelsForBrand } from '../../ReduxStore/Slices/productsSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { useNavigate } from 'react-router-dom'; 

const validationSchema = yup.object({
  marca: yup.string().required('Brand is required'),
  modelo: yup.string().required('Model is required'),
  nome: yup.string().required('Name is required'),
  qtd: yup.number().positive('Quantity must be positive').required('Quantity is required'),
});

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const brands = Array.from(new Set(products.map(product => product.marca)));
  const navigate = useNavigate(); 
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      brandOption: 'existing',
      modelOption: 'existing',
      marca: '',
      modelo: '',
      nome: '',
      qtd: '',
    },
    validationSchema: validationSchema,
     onSubmit: async ({ brandOption, modelOption, ...values }) => {
      try {
        await addDoc(collection(db, "products"), values);
        setSubmitted(true); // Set the submitted state to true when product is added
      } catch (error) {
        console.error('Error adding product to Firestore: ', error);
        
      }
    },
  });
  
  const handleAddAnotherProduct = () => {
    formik.resetForm();
    setSubmitted(false);
  };

  useEffect(() => {
    if (formik.values.marca) {
      dispatch(fetchModelsForBrand(formik.values.marca));
    }
  }, [formik.values.marca, dispatch]);

  if (submitted) {
    // Feedback UI after successful submission
    return (
      <Container maxWidth="lg">
        <Typography variant="h3">Product successfully added!</Typography>
        <Box>
          <Button onClick={handleAddAnotherProduct} variant="contained">
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
      <Typography variant="h2">Adicionar Produto</Typography>
      <Paper elevation={2}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl component="fieldset" sx={{ marginBottom: '20px' }}>
            <FormLabel component="legend">Add a new product from an existing brand or add a new brand?</FormLabel>
            <RadioGroup
              row
              name="brandOption"
              value={formik.values.brandOption}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="existing" control={<Radio />} label="Existing Brand" />
              <FormControlLabel value="new" control={<Radio />} label="New Brand" />
            </RadioGroup>
          </FormControl>
          <Box sx={{ '& .MuiTextField-root': { width: '100%', marginBottom: '20px' } }}>
            {formik.values.brandOption === 'existing' ? (
              <Autocomplete
                options={brands}
                getOptionLabel={(option) => option}
                onChange={(event, value) => formik.setFieldValue('marca', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Brand"
                    variant="outlined"
                    error={formik.touched.marca && Boolean(formik.errors.marca)}
                    helperText={formik.touched.marca && formik.errors.marca}
                  />
                )}
              />
            ) : (
              <TextField
                label="New Brand"
                name="marca"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.marca}
                error={formik.touched.marca && Boolean(formik.errors.marca)}
                helperText={formik.touched.marca && formik.errors.marca}
              />
            )}
            {formik.values.marca && (
              <React.Fragment>
                <FormControl component="fieldset" sx={{ marginBottom: '20px' }}>
                  <FormLabel component="legend">Use an existing model or add a new model?</FormLabel>
                  <RadioGroup
                    row
                    name="modelOption"
                    value={formik.values.modelOption}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value="existing" control={<Radio />} label="Existing Model" />
                    <FormControlLabel value="new" control={<Radio />} label="New Model" />
                  </RadioGroup>
                </FormControl>
                {formik.values.modelOption === 'existing' ? (
                  <Autocomplete
                    options={products.filter(product => product.marca === formik.values.marca).map(product => product.modelo)}
                    getOptionLabel={(option) => option}
                    onChange={(event, value) => formik.setFieldValue('modelo', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Model"
                        variant="outlined"
                        error={formik.touched.modelo && Boolean(formik.errors.modelo)}
                        helperText={formik.touched.modelo && formik.errors.modelo}
                      />
                    )}
                  />
                ) : (
                  <TextField
                    label="New Model"
                    name="modelo"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.modelo}
                    error={formik.touched.modelo && Boolean(formik.errors.modelo)}
                    helperText={formik.touched.modelo && formik.errors.modelo}
                  />
                )}
              </React.Fragment>
            )}
            {formik.values.modelo && (
              <TextField
                label="Nome"
                name="nome"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.nome}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
            )}
            {formik.values.nome && (
              <TextField
                label="Quantity"
                name="qtd"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.qtd}
                error={formik.touched.qtd && Boolean(formik.errors.qtd)}
                helperText={formik.touched.qtd && formik.errors.qtd}
              />
            )}
            <Button type="submit" variant="contained" disabled={!formik.values.nome || !formik.values.qtd}>
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container >
  );
};

export default AddProduct;

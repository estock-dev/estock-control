import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  marca: yup.string().required('Marca é obrigatória'),
  modelo: yup.string().required('Modelo é obrigatório'),
  nome: yup.string().required('Nome é obrigatório'),
  qtd: yup.number().positive('Quantidade não pode ser negativa').required('Quantidade é obrigatória'),
});

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const brands = Array.from(new Set(products.map(product => product.marca)));
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
    onSubmit: async ({ brandOption, modelOption, ...values }) => {
      try {
        await addDoc(collection(db, "products"), values);
        setSubmitted(true);
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
    return (
      <Container maxWidth="lg">
        <Typography variant="h3">Produto adicionado com sucesso!</Typography>
        <Box>
          <Button onClick={handleAddAnotherProduct} variant="contained">
            Adicionar outro produto
          </Button>
          <Button onClick={() => navigate('/')} variant="contained" color="secondary">
            Ir para o início
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={2}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl component="fieldset" sx={{ marginBottom: '20px' }}>
            <FormLabel component="legend">Adicionar um produto de uma marca existente ou adicionar uma nova marca?</FormLabel>
            <RadioGroup
              row
              name="brandOption"
              value={formik.values.brandOption}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="existing" control={<Radio />} label="Marca Existente" />
              <FormControlLabel value="new" control={<Radio />} label="Nova Marca" />
            </RadioGroup>
          </FormControl>
          <Box sx={{ '& .MuiTextField-root': { width: '100%', marginBottom: '20px' } }}>
            {formik.values.brandOption === 'existing' ? (
              <Autocomplete
                options={brands}
                getOptionLabel={(option) => option}
                onChange={(value) => formik.setFieldValue('marca', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecionar Marca"
                    variant="outlined"
                    error={formik.touched.marca && Boolean(formik.errors.marca)}
                    helperText={formik.touched.marca && formik.errors.marca}
                  />
                )}
              />
            ) : (
              <TextField
                label="Nova Marca"
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
                  <FormLabel component="legend">Usar um modelo existente ou adicionar um novo?</FormLabel>
                  <RadioGroup
                    row
                    name="modelOption"
                    value={formik.values.modelOption}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value="existing" control={<Radio />} label="Modelo Existente" />
                    <FormControlLabel value="new" control={<Radio />} label="Novo Modelo" />
                  </RadioGroup>
                </FormControl>
                {formik.values.modelOption === 'existing' ? (
                  <Autocomplete
                    options={products.filter(product => product.marca === formik.values.marca).map(product => product.modelo)}
                    getOptionLabel={(option) => option}
                    onChange={(value) => formik.setFieldValue('modelo', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Selecionar Modelo"
                        variant="outlined"
                        error={formik.touched.modelo && Boolean(formik.errors.modelo)}
                        helperText={formik.touched.modelo && formik.errors.modelo}
                      />
                    )}
                  />
                ) : (
                  <TextField
                    label="Novo Modelo"
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
                label="Quantidade"
                name="qtd"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.qtd}
                error={formik.touched.qtd && Boolean(formik.errors.qtd)}
                helperText={formik.touched.qtd && formik.errors.qtd}
              />
            )}
            <Button type="submit" variant="contained" disabled={!formik.values.nome || !formik.values.qtd}>
              Adicionar Produto
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduct;

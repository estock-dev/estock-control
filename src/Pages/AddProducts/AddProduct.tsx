import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { db } from '../../Configuration/firebase'
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';

const AddProductSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  price: Yup.number().positive('Price must be positive').required('Required'),
  description: Yup.string().required('Required'),
  image: Yup.mixed().required('An image is required').nullable(),
  quantity: Yup.number().min(0, 'Quantity cannot be negative').required('Required'),
});

interface FormValues {
  marca: string;
  modelo: string;
  nome: string;
  qtd: number;
}

const AddProduct = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      marca: '',
      modelo: '',
      nome: '',
      qtd: 0
    },
    validationSchema: AddProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setSubmitError(null);

      try {

        const docRef = await addDoc(collection(db, 'products'), {
          marca: values.marca,
          modelo: values.modelo,
          nome: values.nome,
          qtd: Number(values.qtd),
        });

        console.log('Document written with ID: ', docRef.id);
        alert('Product added successfully');
        resetForm();
      } catch (error) {
        console.error('Error adding product: ', error);
        setSubmitError(error instanceof Error ? error.message : String(error));
        alert('Error adding product, please try again.');
      }

      setSubmitting(false);
    },
  });
  const formFieldStyles = {
    marginBottom: '10px',
    '& .MuiInputBase-root': {
      color: 'black', // Set text color
    },
    '& .MuiInputLabel-root': {
      color: 'black', // Set label color
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black', // Set border color
    },
  };

  const buttonStyles = {
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold', // This makes the font bolder
          fontSize: '24px', // Adjust the font size as needed
          color: 'rgb(108, 108, 108)', // This is typically the default for MUI Typography
          letterSpacing: '0.00735em', // Standard MUI letter spacing for h2 variant
          textAlign: 'left',
          marginTop: '20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.42)', // This adds the underline similar to the screenshot
          paddingBottom: '8px', // This gives some space between the text and the underline
          marginBottom: '32px', // Adds margin below the title for spacing
        }}
      >
        Adicionar produto
      </Typography>
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
          variant="outlined"
          sx={formFieldStyles}
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
          variant="outlined"
          sx={formFieldStyles}
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
          variant="outlined"
          sx={formFieldStyles}
        />
        <TextField
          label="Quantity"
          id="qtd"
          name="qtd"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.qtd}
          error={formik.touched.qtd && Boolean(formik.errors.qtd)}
          helperText={formik.touched.qtd && formik.errors.qtd}
          variant="outlined"
          sx={formFieldStyles}
        />

        <Button type="submit" disabled={formik.isSubmitting} sx={buttonStyles}>
          Add Product
        </Button>
      </Box>
    </Box>
  );
};

export default AddProduct;
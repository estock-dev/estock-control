import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { AnyObject } from 'yup';

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<AnyObject>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateDoc(doc(db, 'products', id!), {
      ...product
    });
    navigate('/view-products');
  };

  if (isLoading) {
    return <Container maxWidth="lg"><div>Loading...</div></Container>;
  }

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
        Editar Produto
      </Typography>
  
      <Paper elevation={2} sx={{ padding: '24px', marginBottom: '24px' }}>
        <TextField
          fullWidth
          label="Marca"
          name="marca"
          value={product.marca}
          onChange={handleChange}
          margin="normal"
          type="string"
        />
        <TextField
          fullWidth
          label="Modelo"
          name="modelo"
          value={product.modelo}
          onChange={handleChange}
          margin="normal"
          type="string"
        />
        <TextField
          fullWidth
          label="Nome"
          name="nome"
          multiline
          rows={4}
          value={product.nome}
          onChange={handleChange}
          margin="normal"
          type="string"
        />
        <TextField
          fullWidth
          label="Quantidade"
          name="qtd"
          value={product.qtd}
          onChange={handleChange}
          margin="normal"
          type="number"
        />
      </Paper>
  
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="contained" onClick={() => navigate('/view-products')}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Salvar
        </Button>
      </Box>
    </Container>
  );
}

export default EditProduct;

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase'
import Container from '@mui/material/Container';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AnyObject } from 'yup';

const ViewProductsList: React.FC = () => {
  const [products, setProducts] = useState<AnyObject[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArray);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    // Use window.confirm to show a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const navigate = useNavigate();
  const handleEdit = (id: string) => {
    navigate(`/edit-product/${id}`);
  };

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
  Consultar Estoque
</Typography>
 
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Marca</TableCell>
              <TableCell align="left">Modelo</TableCell>
              <TableCell align="left">Nome</TableCell>
              <TableCell align="right">Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                
                <TableCell align="left">{product.marca}</TableCell>
                <TableCell align="left">{product.modelo}</TableCell>
                <TableCell align="left">{product.nome}</TableCell>
                <TableCell align="right">{product.qtd}</TableCell>
                <TableCell align="right">
                  <Button 
                    sx={{ 
                      backgroundColor: 'black', 
                      color: 'white', 
                      '&:hover': { backgroundColor: 'black', opacity: 0.85 },
                      marginRight: 1,
                    }} 
                    onClick={() => handleEdit(product.id)}
                  >
                    Editar
                  </Button>
                  <Button 
                    sx={{ 
                      backgroundColor: 'red', 
                      color: 'white', 
                      '&:hover': { backgroundColor: 'darkred' } 
                    }} 
                    onClick={() => handleDelete(product.id)}
                  >
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ViewProductsList;

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase'
import Container from '@mui/material/Container';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewProductsList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

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
  Products List
</Typography>
 
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Marca</TableCell>
              <TableCell align="left">MODELO</TableCell>
              <TableCell align="left">NOME</TableCell>
              <TableCell align="right">QTD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="product">
                  <img src={product.photoURL} alt={product.name} style={{ width: '50px', height: '50px' }} />
                </TableCell>
                <TableCell align="left">{product.name}</TableCell>
                <TableCell align="left">${product.price}</TableCell>
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
                    Edit
                  </Button>
                  <Button 
                    sx={{ 
                      backgroundColor: 'red', 
                      color: 'white', 
                      '&:hover': { backgroundColor: 'darkred' } 
                    }} 
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
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

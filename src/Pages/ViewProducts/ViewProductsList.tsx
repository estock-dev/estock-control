import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { Container, Typography, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ImportProductsCSV from '../../Configuration/CsvImport';

interface Product {
  id: string;
  marca: string;
  modelo: string;
  nome: string;
  qtd: number;
}

const ViewProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showImport, setShowImport] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id, 
        ...docSnapshot.data() 
      }) as Product));
    };

    fetchProducts();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const columns: GridColDef[] = [
    { field: 'marca', headerName: 'MARCA', width: 130},
    { field: 'modelo', headerName: 'MODELO', width: 200},
    { field: 'nome', headerName: 'NOME', width: 200},
    { field: 'qtd', headerName: 'QUANTIDADE', type: 'number', width: 130, headerAlign: 'right', align: 'right'},
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: '100%'
        }}>
          <IconButton onClick={(event) => {
            event.stopPropagation();
            handleEdit(String(params.id));
          }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={(event) => handleDelete(String(params.id), event)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

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
      
      <DataGrid
        rows={products}
        columns={columns}
        checkboxSelection
        autoHeight
        rowHeight={30} // Smaller row height
      />
      
      <Typography
        sx={{ cursor: 'pointer', mt: 2 }}
        onClick={() => setShowImport(!showImport)}
        color="primary"
      >
        Import CSV
      </Typography>
      
      {showImport && <ImportProductsCSV />}
    </Container>
  );
};

export default ViewProductsList;

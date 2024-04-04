import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { fetchProducts, ProductItem, updateProductQuantity } from '../../ReduxStore/Slices/productsSlice'; // Ensure this import path matches your structure
import { useAppDispatch, useAppSelector } from '../../ReduxStore/hooks'; // Adjust the import path as necessary


interface RootState {
    products: {
        products: ProductItem[];
        loading: boolean;
    };
}

const StockUpdate: React.FC = () => {
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.products.products);
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
    const [quantityUpdateType, setQuantityUpdateType] = useState<'sale' | 'restock'>('restock');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleUpdateStock = () => {
        const isConfirmed = window.confirm("Are you sure you want to update the stock?");
        if (isConfirmed && selectedProduct) {
            const quantityAdjustment = quantityUpdateType === 'sale' ? -1 : 1; // Adjust this logic as needed
            dispatch(updateProductQuantity({ id: selectedProduct.id, adjustment: quantityAdjustment }));
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h2" sx={{
                fontWeight: 'bold',
                fontSize: '24px',
                color: 'rgb(108, 108, 108)',
                letterSpacing: '0.00735em',
                textAlign: 'left',
                marginTop: '20px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                paddingBottom: '8px',
                marginBottom: '32px',
            }}>
                Atualizar estoque
            </Typography>

            <Paper elevation={2} sx={{ padding: '24px', marginBottom: '24px' }}>
                <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.nome} // Assuming 'nome' is the name field
                    style={{ marginBottom: '20px' }}
                    renderInput={(params) => <TextField {...params} label="Search product" variant="outlined" />}
                    onChange={(event, newValue: ProductItem | null) => {
                        setSelectedProduct(newValue);
                    }}
                />
                <FormControl component="fieldset" style={{ marginBottom: '20px' }}>
                    <FormLabel component="legend">O produto está sendo:</FormLabel>
                    <RadioGroup
                        row
                        aria-label="stock update type"
                        name="stockUpdateType"
                        value={quantityUpdateType}
                        onChange={(e) => setQuantityUpdateType(e.target.value as 'sale' | 'restock')}
                    >
                        <FormControlLabel value="venda" control={<Radio />} label="Vendido" />
                        <FormControlLabel value="reestoque" control={<Radio />} label="Re-estocado" />
                    </RadioGroup>
                </FormControl>
                <Box display="flex" alignItems="center" justifyContent="center" style={{ marginBottom: '20px' }}>
                    <Typography variant="h4" sx={{ marginX: '20px' }}>
                        {selectedProduct ? selectedProduct.qtd : 0} {/* Updated to use 'qtd' from your Redux state */}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        },
                    }}
                    onClick={handleUpdateStock}
                >
                    Atualizar estoque
                </Button>
            </Paper>
        </Container>
    );
};

export default StockUpdate;

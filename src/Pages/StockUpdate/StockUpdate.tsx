import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Button, Box, Paper,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
    Snackbar, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { fetchProducts, ProductItem, updateProductQuantity } from '../../ReduxStore/Slices/productsSlice';
import { useAppDispatch } from '../../ReduxStore/hooks';
import ProductSelector from './../ProductSelector/ProductSelector';

const StockUpdate = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
    const [quantityUpdateType, setQuantityUpdateType] = useState<'sale' | 'restock'>('restock');
    const [quantityUpdate, setQuantityUpdate] = useState<number>(0);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [resetKey, setResetKey] = useState<number>(0);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;

        const quantity = Number(quantityUpdate);
        const existingQuantity = Number(selectedProduct.qtd);
        const quantityAdjustment = quantityUpdateType === 'sale' ? -quantity : quantity;

        const newQuantity = existingQuantity + quantityAdjustment;

        if (newQuantity < 0) {
            alert('Não é possível ter quantidade de estoque negativa.');
            return;
        }

        const isConfirmed = window.confirm(`Tem certeza que quer ${quantityUpdateType === 'sale' ? 'vender' : 're-estocar'} ${Math.abs(quantityAdjustment)} produtos?`);
        if (isConfirmed) {
            await dispatch(updateProductQuantity({ id: selectedProduct.id, adjustment: quantityAdjustment }));
            setOpenSnackbar(true);
            setSelectedProduct(null); // Reset the selected product to refresh the form
            setQuantityUpdate(0); // Reset the quantity update field
            setResetKey(prevKey => prevKey + 1); // Increment the key to reset ProductSelector
        }
    };

    const handleIncrement = () => {
        setQuantityUpdate(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantityUpdate(prevQuantity => Math.max(prevQuantity - 1, 0));
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
                <ProductSelector 
                    key={resetKey} // This key change will cause ProductSelector to re-render
                    onSelectionComplete={(product) => {
                        setSelectedProduct(product);
                    }}
                />
                {selectedProduct && (
                    <>
                        <FormControl component="fieldset" style={{ marginBottom: '20px' }}>
                            <FormLabel component="legend">O produto está sendo:</FormLabel>
                            <RadioGroup
                                row
                                aria-label="stock update type"
                                name="stockUpdateType"
                                value={quantityUpdateType}
                                onChange={(e) => setQuantityUpdateType(e.target.value as 'sale' | 'restock')}
                            >
                                <FormControlLabel value="sale" control={<Radio />} label="Vendido" />
                                <FormControlLabel value="restock" control={<Radio />} label="Re-estocado" />
                            </RadioGroup>
                        </FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <IconButton onClick={handleDecrement} color="primary" >
                                <RemoveCircleOutlineIcon fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" sx={{ marginX: '20px', minWidth: '50px', textAlign: 'center' }}>
                                {quantityUpdate}
                            </Typography>
                            <IconButton onClick={handleIncrement} color="secondary" >
                                <AddCircleOutlineIcon fontSize="large" />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: "right", alignItems: 'center', marginBottom: '20px' }}>
                            <Typography variant="h4" sx={{ marginX: '20px', minWidth: '50px', textAlign: 'center' }}>
                                current quantity available: {selectedProduct.qtd}
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
                                display: 'block',
                                marginTop: '10px'
                            }}
                            onClick={handleUpdateStock}
                        >
                            Atualizar estoque
                        </Button>
                    </>
                )}
            </Paper>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Product quantity updated"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
};

export default StockUpdate;

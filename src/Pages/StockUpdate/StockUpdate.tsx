import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Button, Box, Paper,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
    Snackbar, Dialog, DialogActions, DialogTitle, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { fetchProducts, ProductItem, updateProductQuantity } from '../../ReduxStore/Slices/productsSlice';
import { useAppDispatch } from '../../ReduxStore/hooks';
import ProductSelector from './../ProductSelector/ProductSelector';





const StockUpdate: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
    const [quantityUpdateType, setQuantityUpdateType] = useState<'sale' | 'restock'>('restock');
    const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [quantityUpdate, setQuantityUpdate] = useState<number>(0);

    
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    
    
    const handleUpdateStock = async () => {
        if (!selectedProduct) return;
        const quantityAdjustment = quantityUpdateType === 'sale' ? -quantityUpdate : quantityUpdate;
        const newQuantity = selectedProduct.qtd + quantityAdjustment;
        
        if (newQuantity < 0) {
            alert('Não é possível ter quantidade de estoque negativa.');
            return;
        }
        const isConfirmed = window.confirm(`Tem certeza que quer ${quantityUpdateType === 'sale' ? 'vender' : 're-estocar'} ${Math.abs(quantityAdjustment)} produtos?`);
        if (isConfirmed) {
            await dispatch(updateProductQuantity({ id: selectedProduct.id, adjustment: quantityAdjustment }));
            setSuccessMessage(`Estoque ${quantityUpdateType === 'sale' ? 'diminuído' : 'aumentado'} com sucesso.`);
            setOpenSnackbar(true);
            setOpenDialog(true);
            // After updating, reset the adjustment amount and fetch products again to get updated quantities
            setAdjustmentAmount(0);
            dispatch(fetchProducts());
        }
    };


    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        if (selectedProduct) {
            let newQuantity = selectedProduct.qtd;
            if (type === 'increment' && quantityUpdateType === 'restock') {
                newQuantity += 1;
            } else if (type === 'decrement' && quantityUpdateType === 'sale' && newQuantity > 0) {
                newQuantity -= 1;
            }
            setSelectedProduct({ ...selectedProduct, qtd: newQuantity });
            setAdjustmentAmount(newQuantity - selectedProduct.qtd);
        }
    };

    const handleIncrement = () => {
            let quantityIncrease = quantityUpdate
            setQuantityUpdate(quantityIncrease += 1);
        
    };

    const handleDecrement = () => {
        if ((selectedProduct?.qtd ?? 0) + adjustmentAmount > 0) {
            let quantityDecrease = quantityUpdate
            setQuantityUpdate(quantityDecrease -= 1);
        }
    };

    const handleGoToViewProducts = () => {
        navigate('/view-products');
        setOpenDialog(false);
    };

    const handleGoToHome = () => {
        navigate('/home');
        setOpenDialog(false);
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
                <ProductSelector onSelectionComplete={(product) => {
                    setSelectedProduct(product);
                    // Set the adjustmentAmount to reflect the quantity of the selected product
                    setAdjustmentAmount(product?.qtd || 0); // Set to product quantity or 0 if product is null
                }} />
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
                                {quantityUpdate} {/* Display the adjustment amount */}
                            </Typography>
                            <IconButton onClick={handleIncrement} color="secondary" >
                                <AddCircleOutlineIcon fontSize="large" />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: "right", alignItems: 'center', marginBottom: '20px' }}>
                        <Typography variant="h4" sx={{ marginX: '20px', minWidth: '50px', textAlign: 'center' }}>
                                current quantity available: {selectedProduct.qtd} {/* Display the adjustment amount */}
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
                                display: 'block', // to make the button take full width
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
                onClose={() => setOpenSnackbar(false)}
                message={successMessage}
            />
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Estoque atualizado!</DialogTitle>
                <DialogActions>
                    <Button onClick={handleGoToViewProducts} color="primary">
                        Editar outro produto
                    </Button>
                    <Button onClick={handleGoToHome} color="primary" autoFocus>
                        Voltar para o início
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default StockUpdate;

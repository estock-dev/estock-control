import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, Paper,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
    Snackbar, Dialog, DialogActions, DialogTitle
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { fetchProducts, ProductItem, updateProductQuantity } from '../../ReduxStore/Slices/productsSlice';
import { useAppDispatch, useAppSelector } from '../../ReduxStore/hooks';

const StockUpdate: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products);
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
    const [quantityUpdateType, setQuantityUpdateType] = useState<'sale' | 'restock'>('restock');
    const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleUpdateStock = async () => {
        if (!selectedProduct || adjustmentAmount <= 0) return;

        const isConfirmed = window.confirm(`Tem certeza que quer ${quantityUpdateType === 'sale' ? 'vender' : 're-estocar'} ${adjustmentAmount} produtos?`);
        if (isConfirmed) {
            const quantityAdjustment = quantityUpdateType === 'sale' ? -Math.abs(adjustmentAmount) : Math.abs(adjustmentAmount);
            await dispatch(updateProductQuantity({ id: selectedProduct.id, adjustment: quantityAdjustment }));

            setSuccessMessage(`Estoque ${quantityUpdateType === 'sale' ? 'diminuído' : 'aumentado'} com sucesso.`);
            setOpenSnackbar(true);
            setOpenDialog(true);

            setAdjustmentAmount(0);
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
                <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.nome}
                    style={{ marginBottom: '20px' }}
                    renderInput={(params) => <TextField {...params} label="Procurar produto" variant="outlined" />}
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
                        <FormControlLabel value="sale" control={<Radio />} label="Vendido" />
                        <FormControlLabel value="restock" control={<Radio />} label="Re-estocado" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    label={`Quantidade de produtos ${quantityUpdateType === 'sale' ? 'vendidos' : 're-estocados'}`}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: '20px' }}
                />

                <Box display="flex" alignItems="center" justifyContent="center" style={{ marginBottom: '20px' }}>
                    <Typography variant="h4" sx={{ marginX: '20px' }}>
                        {selectedProduct ?
                            selectedProduct.qtd + (quantityUpdateType === 'sale' ? -adjustmentAmount : adjustmentAmount) :
                            0}
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

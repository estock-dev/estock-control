import React, { useState, useEffect } from 'react';
import {
    Typography, Box,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
    Snackbar, IconButton
} from '@mui/material';
import { Button } from 'antd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { fetchProducts, ProductItem, updateProductQuantity } from '../../ReduxStore/Slices/productsSlice';
import { useAppDispatch, useAppSelector } from '../../ReduxStore/hooks';
import ProductSelector from './../ProductSelector/ProductSelector';

const StockUpdate = () => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
    const [quantityUpdate, setQuantityUpdate] = useState(0);
    const [quantityUpdateType, setQuantityUpdateType] = useState<'sale' | 'restock'>('restock');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (selectedBrand && selectedModel && selectedName) {
          const product = products.find(p => 
            p.marca === selectedBrand && 
            p.modelo === selectedModel && 
            p.nome === selectedName
          ) || null; // Ensure that 'product' is null if not found
          setSelectedProduct(product);
        } else {
          setSelectedProduct(null);
        }
      }, [selectedBrand, selectedModel, selectedName, products]);

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;

        const quantityAdjustment = quantityUpdateType === 'sale' ? -quantityUpdate : quantityUpdate;
        const newQuantity = selectedProduct.qtd + quantityAdjustment;

        if (newQuantity < 0) {
            alert('Não é possível ter quantidade de estoque negativa.');
            return;
        }

        const isConfirmed = window.confirm(`Confirm the ${quantityUpdateType === 'sale' ? 'sale' : 'restock'} of ${Math.abs(quantityAdjustment)} units?`);
        if (isConfirmed) {
            await dispatch(updateProductQuantity({ id: selectedProduct.id, adjustment: quantityAdjustment }));
            setOpenSnackbar(true);
            resetForm();
        }
    };

    const resetForm = () => {
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedName(null);
        setQuantityUpdate(0);
    };

    const handleIncrement = () => {
        setQuantityUpdate(quantityUpdate + 1);
    };

    const handleDecrement = () => {
        setQuantityUpdate(Math.max(0, quantityUpdate - 1));
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className='view-products-list'>
                <ProductSelector
                    onSelectionChange={(brand, model, name) => {
                        setSelectedBrand(brand);
                        setSelectedModel(model);
                        setSelectedName(name);
                    }}
                    stepByStep={true}
                />
                {selectedProduct && (
                    <>
                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                            <FormLabel component="legend">Update Type:</FormLabel>
                            <RadioGroup
                                row
                                value={quantityUpdateType}
                                onChange={(e) => setQuantityUpdateType(e.target.value as 'sale' | 'restock')}
                            >
                                <FormControlLabel value="sale" control={<Radio />} label="Sale" />
                                <FormControlLabel value="restock" control={<Radio />} label="Restock" />
                            </RadioGroup>
                        </FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <IconButton onClick={handleDecrement} color="primary">
                                <RemoveCircleOutlineIcon fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" sx={{ mx: 2, minWidth: 50, textAlign: 'center' }}>
                                {quantityUpdate}
                            </Typography>
                            <IconButton onClick={handleIncrement} color="secondary">
                                <AddCircleOutlineIcon fontSize="large" />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: "right", alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" sx={{ mx: 2, minWidth: 50, textAlign: 'center' }}>
                                Current Quantity: {selectedProduct.qtd}
                            </Typography>
                        </Box>
                        <Button
                            onClick={handleUpdateStock}
                        >
                            Update Stock
                        </Button>
                    </>
                )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Product quantity updated"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </div>
    );
};

export default StockUpdate;

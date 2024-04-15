import React from 'react';
import { Row, Col, Tag, Button, message as antdMessage } from 'antd';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../ReduxStore/hooks';
import {
  selectProduct,
  removeSelectedProduct,
  setIncludeQuantity,
  fetchProducts
} from '../../../ReduxStore/Slices/productsSlice';

const FindProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const selectedProducts = useAppSelector((state) => state.products.selectedProducts);
  const formattedMessage = useAppSelector((state) => state.products.formattedMessage);

  // Dispatch fetchProducts once on component mount
  React.useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductSelect = (event: React.SyntheticEvent<Element, Event>, value: string | null) => {
    // Find the product in the redux store's product list by name
    if (value !== null) {
      const selectedProduct = products.find((product) => `${product.marca} ${product.modelo} ${product.nome}` === value);
      if (selectedProduct) {
        dispatch(selectProduct(selectedProduct));
      }
    }
  };

  const handleRemoveSelectedProduct = (productId: string) => {
    dispatch(removeSelectedProduct(productId));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => antdMessage.success('Texto copiado! Agora é só colar onde quiser'),
      () => antdMessage.error('A cópia do texto falhou :( Por favor, tente novamente.')
    );
  };

  return (
    <div><h1>find product</h1></div>
  );
};

export default FindProduct;

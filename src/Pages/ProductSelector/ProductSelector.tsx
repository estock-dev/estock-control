import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from './../../ReduxStore/hooks';
import { fetchProducts, ProductItem } from './../../ReduxStore/Slices/productsSlice'

export interface ProductSelectorProps {
  onSelectionComplete: (product: ProductItem | null) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelectionComplete }) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);  // Rename for clarity

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const brands = Array.from(new Set(products.map(product => product.marca)));
  const models = selectedBrand ? products.filter(product => product.marca === selectedBrand).map(product => product.modelo) : [];
  const names = selectedModel ? products.filter(product => product.modelo === selectedModel && product.marca === selectedBrand).map(product => product.nome) : [];

  return (
    <div>
      <Autocomplete
        options={brands}
        style={{ marginBottom: '20px' }}
        renderInput={(params) => <TextField {...params} label="Select Brand" variant="outlined" />}
        onChange={(event, newValue: string | null) => {
          setSelectedBrand(newValue);
          setSelectedModel(null);
          setSelectedName(null);  // Clear subsequent selections
        }}
      />
      {selectedBrand && (
        <Autocomplete
          options={models}
          style={{ marginBottom: '20px', backgroundColor: 'lightblue' }}  // Visual feedback
          renderInput={(params) => <TextField {...params} label="Select Model" variant="outlined" />}
          onChange={(event, newValue: string | null) => {
            setSelectedModel(newValue);
            setSelectedName(null);  // Clear subsequent selections
          }}
        />
      )}
      {selectedModel && (
        <Autocomplete
          options={names}
          style={{ marginBottom: '20px', backgroundColor: 'lightgreen' }}  // Visual feedback
          renderInput={(params) => <TextField {...params} label="Select Name" variant="outlined" />}
          onChange={(event, newValue: string | null) => {
            setSelectedName(newValue);
            const product = products.find(p => p.nome === newValue && p.modelo === selectedModel && p.marca === selectedBrand) || null;
            onSelectionComplete(product);
          }}
        />
      )}
    </div>
  );
};

export default ProductSelector;

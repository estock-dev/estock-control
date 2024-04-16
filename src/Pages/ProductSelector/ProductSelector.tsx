import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from './../../ReduxStore/hooks';
import { fetchProducts } from './../../ReduxStore/Slices/productsSlice';

export interface ProductSelectorProps {
  onSelectionChange: (brand: string | null, model: string | null, name: string | null) => void;
  stepByStep?: boolean;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelectionChange, stepByStep = false }) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    onSelectionChange(selectedBrand, selectedModel, selectedName);
  }, [selectedBrand, selectedModel, selectedName, onSelectionChange]);

  const brands = Array.from(new Set(products.map(product => product.marca)));
  const models = selectedBrand 
    ? Array.from(new Set(products.filter(product => product.marca === selectedBrand).map(product => product.modelo)))
    : Array.from(new Set(products.map(product => product.modelo)));
  const names = selectedModel && selectedBrand 
    ? products.filter(product => product.modelo === selectedModel && product.marca === selectedBrand).map(product => product.nome)
    : Array.from(new Set(products.map(product => product.nome)));

  const handleBrandChange = (_event: unknown, newValue: string | null) => {
    setSelectedBrand(newValue);
    setSelectedModel(null);
    setSelectedName(null);
  };

  const handleModelChange = (_event: unknown, newValue: string | null) => {
    setSelectedModel(newValue);
    setSelectedName(null);
  };

  const handleNameChange = (_event: unknown, newValue: string | null) => {
    setSelectedName(newValue);
  };

  return (
    <div>
      <Autocomplete
        options={brands}
        value={selectedBrand}
        renderInput={(params) => <TextField {...params} label="Marca" variant="outlined" />}
        onChange={handleBrandChange}
        style={{ marginBottom: '20px' }}
      />
      <Autocomplete
        options={models}
        value={selectedModel}
        renderInput={(params) => <TextField {...params} label="Modelo" variant="outlined" />}
        onChange={handleModelChange}
        style={{ marginBottom: '20px' }}
        disabled={!selectedBrand && stepByStep}
      />
      <Autocomplete
        options={names}
        value={selectedName}
        renderInput={(params) => <TextField {...params} label="Nome" variant="outlined" />}
        onChange={handleNameChange}
        style={{ marginBottom: '20px' }}
        disabled={(!selectedBrand || !selectedModel) && stepByStep}
      />
    </div>
  );
};

export default ProductSelector;

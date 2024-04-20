import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { useAppDispatch, useAppSelector } from './../../ReduxStore/hooks';
import { fetchProducts } from './../../ReduxStore/Slices/productsSlice';

export interface ProductSelectorProps {
  onSelectionChange: (brand: string | null, model: string | null, name: string | null) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelectionChange }) => {
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

  // Get unique brands
  const brandsOptions = Array.from(new Set(products.map(product => product.marca))).map(marca => ({
    value: marca,
  }));

  // Get models based on the selected brand
  const modelsOptions = selectedBrand
    ? Array.from(
        new Set(products.filter(product => product.marca === selectedBrand).map(product => product.modelo))
      ).map(modelo => ({ value: modelo }))
    : [];

  // Get names based on the selected brand and model
  const namesOptions = selectedBrand && selectedModel
    ? products
        .filter(product => product.marca === selectedBrand && product.modelo === selectedModel)
        .map(product => ({ value: product.nome }))
    : [];

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedModel(null); // Reset model when brand changes
    setSelectedName(null);  // Reset name when brand changes
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    setSelectedName(null); // Reset name when model changes
  };

  const handleNameChange = (value: string) => {
    setSelectedName(value);
  };

  return (
    <div>
      <AutoComplete
        options={brandsOptions}
        value={selectedBrand}
        placeholder="Marca"
        style={{ width: '100%', marginBottom: '20px' }}
        onChange={handleBrandChange}
        allowClear
      />
      {selectedBrand && (
        <AutoComplete
          options={modelsOptions}
          value={selectedModel}
          placeholder="Modelo"
          style={{ width: '100%', marginBottom: '20px' }}
          onChange={handleModelChange}
          allowClear
        />
      )}
      {selectedModel && selectedBrand && (
        <AutoComplete
          options={namesOptions}
          value={selectedName}
          placeholder="Nome"
          style={{ width: '100%', marginBottom: '20px' }}
          onChange={handleNameChange}
          allowClear
        />
      )}
    </div>
  );
};

export default ProductSelector;

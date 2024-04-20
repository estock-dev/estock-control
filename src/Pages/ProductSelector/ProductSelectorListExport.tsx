import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { useAppDispatch, useAppSelector } from './../../ReduxStore/hooks';
import { fetchProducts } from './../../ReduxStore/Slices/productsSlice';

export interface ProductSelectorListExportProps {
  onSelectionChange: (brand: string | null, model: string | null, name: string | null) => void;
  selectedNames?: string[];
  stepByStep?: boolean;
}

const ProductSelectorListExport: React.FC<ProductSelectorListExportProps> = ({
  onSelectionChange,
  stepByStep = false,
}) => {
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

  // Extract unique brands, models, and names from products
  const brandOptions = Array.from(new Set(products.map(product => product.marca)))
    .map(marca => ({ value: marca }));
  const modelOptions = selectedBrand || !stepByStep
    ? Array.from(new Set(products.filter(product => !selectedBrand || product.marca === selectedBrand)
      .map(product => product.modelo)))
    .map(modelo => ({ value: modelo }))
    : [];
  const nameOptions = (selectedModel && selectedBrand) || !stepByStep
    ? Array.from(new Set(products.filter(product => (!selectedBrand || product.marca === selectedBrand) &&
      (!selectedModel || product.modelo === selectedModel))
      .map(product => product.nome)))
    .map(nome => ({ value: nome }))
    : [];

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    if (stepByStep) {
      setSelectedModel(null);
      setSelectedName(null);
    }
    onSelectionChange(value, null, null);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    if (stepByStep) {
      setSelectedName(null);
    }
    onSelectionChange(selectedBrand, value, null);
  };

  const handleNameChange = (value: string) => {
    setSelectedName(value);
    onSelectionChange(selectedBrand, selectedModel, value);
  };

  return (
    <div>
      <AutoComplete
        options={brandOptions}
        value={selectedBrand}
        placeholder="Marca"
        style={{ width: '100%', marginBottom: '20px' }}
        onChange={handleBrandChange}
        allowClear
        
      />
      <AutoComplete
        options={modelOptions}
        value={selectedModel}
        placeholder="Modelo"
        style={{ width: '100%', marginBottom: '20px' }}
        onChange={handleModelChange}
        allowClear
        
      />
      <AutoComplete
        options={nameOptions}
        value={selectedName}
        placeholder="Nome"
        style={{ width: '100%', marginBottom: '20px' }}
        onChange={handleNameChange}
        allowClear
        
      />
    </div>
  );
};

export default ProductSelectorListExport;

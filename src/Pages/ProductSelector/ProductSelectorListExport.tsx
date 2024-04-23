import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from './../../ReduxStore/hooks';
import { fetchProducts } from './../../ReduxStore/Slices/productsSlice';

const { Option } = Select;

export interface ProductSelectorListExportProps {
  onSelectionChange: (brand: string[] | null, model: string[] | null, name: string[] | null) => void;
}

const ProductSelectorListExport: React.FC<ProductSelectorListExportProps> = ({
  onSelectionChange,
}) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    onSelectionChange(selectedBrands, selectedModels, selectedNames);
  }, [selectedBrands, selectedModels, selectedNames, onSelectionChange]);

  const handleSelectionChange = (value: string[], type: 'brand' | 'model' | 'name') => {
    switch (type) {
      case 'brand':
        setSelectedBrands(value);
        break;
      case 'model':
        setSelectedModels(value);
        break;
      case 'name':
        setSelectedNames(value);
        break;
      default:
        break;
    }
    onSelectionChange(selectedBrands, selectedModels, selectedNames);
  };
  
  const generateOptions = (field: 'marca' | 'modelo' | 'nome'): string[] => {
    let filteredProducts = products;
  
    // If any brands are selected, filter the products by those brands
    if (selectedBrands.length > 0 && field !== 'marca') {
      filteredProducts = filteredProducts.filter(product => selectedBrands.includes(product.marca));
    }
  
    // If any models are selected, filter the products by those models
    if (selectedModels.length > 0 && field !== 'modelo') {
      filteredProducts = filteredProducts.filter(product => selectedModels.includes(product.modelo));
    }
  
    // If any names are selected, filter the products by those names
    if (selectedNames.length > 0 && field !== 'nome') {
      filteredProducts = filteredProducts.filter(product => selectedNames.includes(product.nome));
    }
  
    // Return the unique options for the specified field
    return Array.from(new Set(filteredProducts.map(product => product[field])));
  };
  

  const renderOptions = (options: string[]) => [
    ...options.map((option) => (
      <Option key={option} value={option}>
        {option}
      </Option>
    )),
  ];

  return (
    <div>
      <Select
        mode="multiple"
        style={{ width: '100%', marginBottom: '20px' }}
        placeholder="Marca"
        value={selectedBrands}
        onChange={(value) => handleSelectionChange(value, 'brand')}
        allowClear
      >
        {renderOptions(generateOptions('marca'))}
      </Select>

      <Select
        mode="multiple"
        style={{ width: '100%', marginBottom: '20px' }}
        placeholder="Modelo"
        value={selectedModels}
        onChange={(value) => handleSelectionChange(value, 'model')}
        allowClear
      >
        {renderOptions(generateOptions('modelo'))}
      </Select>

      <Select
        mode="multiple"
        style={{ width: '100%', marginBottom: '20px' }}
        placeholder="Nome"
        value={selectedNames}
        onChange={(value) => handleSelectionChange(value, 'name')}
        allowClear
      >
        {renderOptions(generateOptions('nome'))}
      </Select>
    </div>
  );
};

export default ProductSelectorListExport;

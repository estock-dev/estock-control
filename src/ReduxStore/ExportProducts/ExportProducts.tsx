import React, { useEffect } from 'react';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '../../ReduxStore/hooks';
import { fetchProducts } from '../Slices/productsSlice';

interface GroupedData {
  [brand: string]: {
    [model: string]: string[];
  };
}

interface ProductItem {
  marca: string;
  modelo: string;
  nome: string;
  qtd?: number;
}

const ExportProducts: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  function capitalizeFirstLetter(string: string): string {
    return string
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function convertDataToString(data: ProductItem[]): string {
    if (!data || data.length === 0) {
      message.error('No products available for export.');
      return '';
    }

    const sortedData = [...data].sort((a, b) => {
      return a.marca.localeCompare(b.marca) || a.modelo.localeCompare(b.modelo) || a.nome.localeCompare(b.nome);
    });

    const groupedData: GroupedData = sortedData.reduce((acc: GroupedData, p) => {
      const brand = capitalizeFirstLetter(p.marca);
      const model = capitalizeFirstLetter(p.modelo.replace(p.marca, '').trim());
      const name = capitalizeFirstLetter(p.nome);

      if (!acc[brand]) {
        acc[brand] = {};
      }
      if (!acc[brand][model]) {
        acc[brand][model] = [];
      }
      acc[brand][model].push(name);

      return acc;
    }, {});

    let result = '';
    for (const brand in groupedData) {
      result += `--- ${brand} ---,\n`;
      for (const model in groupedData[brand]) {
        result += `Modelo: ${model}\n`;
        const names = groupedData[brand][model].join(', ');
        result += `Opções: ${names}\n\n`;
      }
      result += '\n';
    }

    return result.trim();
  }

  function copyToClipboard(text: string) {
    if (!text) {
      message.error('Não há dados para copiar.');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      message.success('Lista copiada para o clipboard!');
    }).catch(err => {
      console.error('Error copying to clipboard: ', err);
      message.error('Falha ao copiar para o clipboard. Tente novamente.');
    });
  }

  const handleExportAll = () => {
    const productListString = convertDataToString(products);
    copyToClipboard(productListString);
  };

  return <div onClick={handleExportAll} style={{ cursor: 'pointer' }}>&#160; Exportar Lista Completa</div>;
};

export default ExportProducts;

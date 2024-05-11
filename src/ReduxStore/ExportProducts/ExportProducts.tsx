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
    const sortedData = [...data].sort((a, b) => {
      const brandA = a.marca.toUpperCase();
      const brandB = b.marca.toUpperCase();
      const modelA = a.modelo.toUpperCase();
      const modelB = b.modelo.toUpperCase();
      const nameA = a.nome.toUpperCase();
      const nameB = b.nome.toUpperCase();

      if (brandA < brandB) return -1;
      if (brandA > brandB) return 1;
      if (modelA < modelB) return -1;
      if (modelA > modelB) return 1;
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
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
      result += `--- ${brand} ---\n`;
      for (const model in groupedData[brand]) {
        result += `Modelo: ${model}\n`;
        const names = groupedData[brand][model].join('\n- ');
        result += `Opções: \n- ${names}\n\n`;
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

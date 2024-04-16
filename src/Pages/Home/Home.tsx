import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Button, message } from 'antd';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../ReduxStore/hooks';
import './Home.css';
import { ProductItem } from '../../ReduxStore/Slices/productsSlice';
import { useAppDispatch } from '../../ReduxStore/hooks';
import { useEffect } from 'react';
import { fetchProducts } from '../../ReduxStore/Slices/productsSlice';
const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const products = useAppSelector(state => state.products.products);

  const handleExportAll = () => {
    const productListString = convertDataToString(products);
    copyToClipboard(productListString);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", marginTop: '20px', alignItems: "center", gap: '10px', width: '100%' }}
      className="home-page"
    >
      <Button type="primary" block onClick={() => navigate('/stock-update')}>
        Atualizar Estoque
      </Button>
      <Button type="primary" block onClick={() => navigate('/view-products')}>
        Consultar Estoque
      </Button>
      <Button type="primary" block onClick={handleExportAll}>
        Exportar Lista Rápida
      </Button>
      <Outlet />
    </motion.div>
  );
};

function convertDataToString(data: ProductItem[]): string {
  // Assuming data is always an array and p.qtd is not undefined in any product item
  return data.map(p => `${p.marca}, ${p.modelo}, ${p.nome}, ${p.qtd}`).join('\n');
}

function copyToClipboard(text: string) {
  if (!text) {
    // Notify the user that there is no data to copy
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

export default HomePage;

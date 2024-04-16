import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import './Home.css';


const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

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
      <Button type="primary" block onClick={() => navigate('/generate-message')}>
        Exportar Lista Rápida
      </Button>
      <Outlet />
    </motion.div>
  );
};

export default HomePage;
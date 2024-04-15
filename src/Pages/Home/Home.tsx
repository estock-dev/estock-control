import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Button, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import './Home.css';

const { Panel } = Collapse;

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
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
      >
        <Panel header="ESTOQUE" key="1" style={{ color: 'white'}} className="site-collapse-custom-panel">
          <Button type="primary" block onClick={() => navigate('/stock-update')}>
            ATUALIZAR
          </Button>
          <Button type="primary" block onClick={() => navigate('/view-products')}>
            CONSULTAR
          </Button>
          <Button type="primary" block onClick={() => navigate('/add-product')}>
            ADICIONAR NOVO PRODUTO
          </Button>
        </Panel>
        <Panel header="GERAR MENSAGEM" key="2" className="site-collapse-custom-panel">
          <Button type="primary" block onClick={() => navigate('/generate-message')}>
            SELECIONAR PRODUTOS
          </Button>
          <Button type="primary" block onClick={() => { }}>
            EXPORTAR ESTOQUE COMPLETO
          </Button>
        </Panel>
      </Collapse>

      <Outlet />
    </motion.div>
  );
};

export default HomePage;
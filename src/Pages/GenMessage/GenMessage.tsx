import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { Row, Col, Tabs, Switch, Menu } from 'antd';
import { motion } from 'framer-motion';
import FindProduct from './TabPanels/FindProduct';
import { Divider } from 'antd';
import { Button } from 'antd'
import CopyOutlined from '@ant-design/icons';

interface Product {
  marca: string;
  modelo: string;
  nome: string;
  qtd: number;
}

const { TabPane } = Tabs;

const GenMessage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [includeQuantity, setIncludeQuantity] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>('marcas');
  const [formattedMessage, setFormattedMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map(doc => doc.data() as Product));
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let message = '';
    switch (selectedKey) {
      case 'marcas':
        const uniqueMarcas = Array.from(new Set(products.map(p => p.marca))).sort();
        message = `Segue lista de marcas disponíveis a pronta entrega:\n${uniqueMarcas.join('\n')}`;
        break;
      case 'modelos':
        const uniqueModelos = Array.from(new Set(products.map(p => p.modelo))).sort();
        message = `Segue a lista de modelos disponíveis a pronta entrega:\n${uniqueModelos.join('\n')}`;
        break;
      case 'details':
        const details = products.map(p => `${p.modelo} ${p.nome}` + (includeQuantity ? ` (${p.qtd})` : '')).sort();
        const uniqueDetails = Array.from(new Set(details));
        message = `Segue a lista de produtos disponíveis a pronta entrega: \n${uniqueDetails.join('\n')}`;
        break;
      default:
        message = '';
    }
    setFormattedMessage(message);
  }, [products, selectedKey, includeQuantity]);



  const showSwitch = selectedKey === 'details';

  return (
    <div style={{ maxWidth: '2000px', margin: '0 auto' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Lista Completa" key="1">
          <Row>
            <Col span={6} style={{ minHeight: '100vh', borderRight: '1px solid #f0f0f0' }}>
              <Menu
                mode="vertical"
                selectedKeys={[selectedKey]}
                style={{ borderRight: 'none' }}
              >
                <Menu.Item key="marcas" onClick={() => setSelectedKey('marcas')}>
                  Marcas
                </Menu.Item>
                <Menu.Item key="modelos" onClick={() => setSelectedKey('modelos')}>
                  Modelos
                </Menu.Item>
                <Menu.Item key="details" onClick={() => setSelectedKey('details')}>
                  Produtos Detalhados
                </Menu.Item>

              </Menu>

              {showSwitch && (
                <div style={{ padding: '16px', paddingTop: '24px' }}>
                  <Switch
                    checkedChildren="Quantidade incluída"
                    unCheckedChildren="Clique para incluir quantidade"
                    checked={includeQuantity}
                    onChange={() => setIncludeQuantity(!includeQuantity)}
                  />
                </div>
              )}
              <Divider />

            </Col>
            <Col span={12} style={{ padding: '24px' }}>
            <div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', width: '100%' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <pre>{formattedMessage}</pre>
              </motion.div>
            </div>
          </Col>
          <Col span={1}>
            <Divider type="vertical" style={{ height: '100vh' }} />
          </Col>
          <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(formattedMessage).then(
                    () => {
                      console.log('Text copied to clipboard');
                    },
                    () => {
                      console.error('Failed to copy text to clipboard');
                    }
                  );
                }}
              >
                COPY TEXT
              </Button>
            </motion.div>
          </Col>
        </Row>
      </TabPane>        <TabPane tab="Lista de Produtos" key="2">
          <FindProduct />
        </TabPane>
      </Tabs>


    </div>
  );
};

export default GenMessage;

// const copyToClipboard = (text: string) => {
//   navigator.clipboard.writeText(text).then(
//     () => antdMessage.success('Texto copiado! Agora é só colar onde quiser'),
//     (err) => antdMessage.error('A cópia do texto falhou :( Por favor, tente novamente. ', err)
//   );
// };
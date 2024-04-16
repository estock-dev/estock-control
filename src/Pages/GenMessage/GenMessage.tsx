import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { message as antdMessage, Row, Col, Tabs, Switch, Menu, Button } from 'antd';
import { motion } from 'framer-motion';
import FindProduct from './FindProduct'

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
        message = `Available marcas:\n${uniqueMarcas.join('\n')}`;
        break;
      case 'modelos':
        const uniqueModelos = Array.from(new Set(products.map(p => p.modelo))).sort();
        message = `Available modelos:\n${uniqueModelos.join('\n')}`;
        break;
      case 'details':
        const details = products.map(p => `${p.modelo} ${p.nome}` + (includeQuantity ? ` (${p.qtd})` : '')).sort();
        const uniqueDetails = Array.from(new Set(details));
        message = `Available detailed products:\n${uniqueDetails.join('\n')}`;
        break;
      default:
        message = '';
    }
    setFormattedMessage(message);
  }, [products, selectedKey, includeQuantity]);

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text).then(
//       () => antdMessage.success('Text copied to clipboard!'),
//       (err) => antdMessage.error('Failed to copy text: ', err)
//     );
//   };

  const showSwitch = selectedKey === 'details';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Full List" key="1">
          <Row>
            <Col span={6} style={{ minHeight: '100vh', borderRight: '1px solid #f0f0f0' }}>
              <Menu
                mode="vertical"
                selectedKeys={[selectedKey]}
                style={{ borderRight: 'none' }}
              >
                <Menu.Item key="marcas" onClick={() => setSelectedKey('marcas')}>
                  Available Marcas
                </Menu.Item>
                <Menu.Item key="modelos" onClick={() => setSelectedKey('modelos')}>
                  Available Modelos
                </Menu.Item>
                <Menu.Item key="details" onClick={() => setSelectedKey('details')}>
                  Available Detailed Products
                </Menu.Item>
              </Menu>
              {showSwitch && (
                <div style={{ padding: '16px', paddingTop: '24px' }}>
                  <Switch
                    checkedChildren="Include quantity"
                    unCheckedChildren="Exclude quantity"
                    checked={includeQuantity}
                    onChange={() => setIncludeQuantity(!includeQuantity)}
                  />
                </div>
              )}
            </Col>
            <Col span={18} style={{ padding: '24px' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <pre>{formattedMessage}</pre>
              </motion.div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Find Product" key="2">
          <FindProduct setFormattedMessage={setFormattedMessage} />
        </TabPane>
        <TabPane style={{ justifyContent: "right" }}>
          {formattedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', right: '10px', top: '10px' }}
            >
              <Button onClick={() => navigator.clipboard.writeText(formattedMessage)}>
                Copy Text
              </Button>
            </motion.div>
          )}
        </TabPane>
      </Tabs>

    </div>
  );
};

export default GenMessage;
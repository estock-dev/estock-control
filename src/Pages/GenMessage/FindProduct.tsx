import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { Typography, message as antdMessage, Row, Col, AutoComplete, Checkbox, Dropdown, Menu } from 'antd';
import { motion } from 'framer-motion';


const { Text } = Typography;
const { Option } = AutoComplete;

interface Product {
    marca: string;
    modelo: string;
    nome: string;
    qtd: number;
}

interface Props {
    setFormattedMessage: (message: string) => void;
}

const FindProduct: React.FC<Props> = ({ setFormattedMessage }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, 'products'));
            setProducts(querySnapshot.docs.map(doc => doc.data() as Product).sort((a, b) => a.marca.localeCompare(b.marca)));
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const message = selectedProducts.length > 0
            ? `Selected products from the stock:\n${selectedProducts.map(p => `${p.marca} ${p.modelo} ${p.nome}`).join('\n')}`
            : '';
        setFormattedMessage(message);
    }, [selectedProducts, setFormattedMessage]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleSelectProduct = (product: Product, checked: boolean) => {
        setSelectedProducts(prevSelected => {
            if (checked) {
                return [...prevSelected, product];
            } else {
                return prevSelected.filter(selectedProduct => selectedProduct !== product);
            }
        });
    };

    const isProductSelected = (product: Product) => {
        return selectedProducts.includes(product);
    };

    const filteredProducts = searchTerm
        ? products.filter(p =>
            p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const formattedMessage = `Os seguintes produtos estão disponíveis no estoque:\n${selectedProducts.map(p => `${p.marca} ${p.modelo} ${p.nome}`).join('\n')}`;

    const uniqueMarcas = Array.from(new Set(products.map(p => p.marca))).sort();

    const marcasMenu = (
        <Menu>
            {uniqueMarcas.map(marca => (
                <Menu.Item key={marca}>{marca}</Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Row style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Col span={6} style={{ minHeight: '100vh', borderRight: '1px solid #f0f0f0' }}>
                <Dropdown
                    overlay={marcasMenu}
                    onVisibleChange={setVisible}
                    visible={visible}
                    placement="bottomLeft"
                    trigger={['hover']}
                >
                    <div style={{ padding: '16px', paddingTop: '24px' }}>
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <h3>Encontre por marca</h3>
                        </motion.div>
                    </div>
                </Dropdown>
            </Col>
            <Col span={9} style={{ padding: '24px' }}>
                <Text strong style={{ display: 'block', marginBottom: '20px' }}>Procure um produto</Text>
                <AutoComplete
                    style={{ width: '100%' }}
                    onSearch={handleSearch}
                    placeholder="Procure por marca, modelo ou nome"
                >
                    {filteredProducts.map(p => (
                        <Option key={`${p.marca}-${p.modelo}-${p.nome}`} value={`${p.marca} ${p.modelo} ${p.nome}`}>
                            {`${p.marca} ${p.modelo} ${p.nome}`}
                        </Option>
                    ))}
                </AutoComplete>
                {searchTerm && (
                    <div style={{ marginTop: '20px' }}>
                        {filteredProducts.map((product) => (
                            <Checkbox
                                key={`${product.marca}-${product.modelo}-${product.nome}`}
                                onChange={(e) => handleSelectProduct(product, e.target.checked)}
                                checked={isProductSelected(product)}
                            >
                                {`${product.marca} ${product.modelo} ${product.nome} (${product.qtd})`}
                            </Checkbox>
                        ))}
                    </div>
                )}
            </Col>
            <Col span={9} style={{ padding: '24px' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'relative' }}  
                >
                    <pre>{formattedMessage}</pre>
                    
                </motion.div>
            </Col>
        </Row>
    );
};

export default FindProduct;

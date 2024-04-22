import { useState, useEffect } from 'react';
import { Modal, Radio, Form, Button, Typography, notification } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { fetchProducts, ProductItem, updateProductQuantity } from '../../ReduxStore/Slices/productsSlice';
import { useAppDispatch, useAppSelector } from '../../ReduxStore/hooks';
import ProductSelector from './../ProductSelector/ProductSelector';
import './StockUpdate.css'
const { Text } = Typography;



const StockUpdate = () => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
    const [quantityUpdate, setQuantityUpdate] = useState(0);
    const [quantityUpdateType, setQuantityUpdateType] = useState<'sale' | 'restock'>('restock');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (selectedBrand && selectedModel && selectedName) {
            const product = products.find(p =>
                p.marca === selectedBrand &&
                p.modelo === selectedModel &&
                p.nome === selectedName
            ) || null;
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
    }, [selectedBrand, selectedModel, selectedName, products]);

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;

        const quantityAdjustment = quantityUpdateType === 'sale' ? -quantityUpdate : quantityUpdate;
        const newQuantity = selectedProduct.qtd + quantityAdjustment;

        if (newQuantity < 0) {
            notification.error({
                message: 'Não é possível ter quantidade de estoque negativa.',
                duration: 2
            });
            return;
        }

        Modal.confirm({
            title: `Confirmar ${quantityUpdateType === 'sale' ? 'a remoção' : 'o acrécimo'}`,
            okText: 'Ok',
            cancelText: 'Cancelar',
            content: `Deseja confirmar ${quantityUpdateType === 'sale' ? 'a remoção' : 'o acréscimo'} de ${Math.abs(quantityAdjustment)} unidades?`,
            onOk: async () => {
                await dispatch(updateProductQuantity({ id: selectedProduct.id, adjustment: quantityAdjustment }));
                notification.success({
                    message: 'Quantidade do produto atualizada!',
                    duration: 2
                });
                resetForm();
            },
            onCancel() {
                console.log('Atualização de produto cancelada!');
            },
        });
    };

    const resetForm = () => {
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedName(null);
        setQuantityUpdate(0);
    };

    const handleIncrement = () => {
        setQuantityUpdate(quantityUpdate + 1);
    };

    const handleDecrement = () => {
        setQuantityUpdate(Math.max(0, quantityUpdate - 1));
    };

    return (
        <div className='view-products-list'>
            <ProductSelector
                onSelectionChange={(brand, model, name) => {
                    setSelectedBrand(brand);
                    setSelectedModel(model);
                    setSelectedName(name);
                }}
            />
            {selectedProduct && (
                <>
                    <Form layout="vertical" style={{ marginTop: '20px' }}>
                        <Form.Item label="Tipo do processo">
                            <Radio.Group
                                optionType="button"
                                value={quantityUpdateType}
                                onChange={(e) => setQuantityUpdateType(e.target.value)}
                                buttonStyle="solid"
                            >
                                <Radio.Button value="sale">Remover do Estoque</Radio.Button>
                                <Radio.Button value="restock">Acrescentar ao Estoque</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <Button icon={<MinusCircleOutlined />} onClick={handleDecrement} />
                            <Text style={{ margin: '0 16px', fontSize: '24px', minWidth: '50px', textAlign: 'center' }}>{quantityUpdate}</Text>
                            <Button icon={<PlusCircleOutlined />} color="blue" onClick={handleIncrement} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: "right", alignItems: 'center', marginTop: '20px' }}>
                            <Text style={{ margin: '0 16px', fontSize: '18px', textAlign: 'center' }}>Quantidade Atual: {selectedProduct.qtd}</Text>
                        </div>
                        <Button onClick={handleUpdateStock}>Atualizar Estoque</Button>
                    </Form>
                </>
            )}
        </div>
    );
};

export default StockUpdate;

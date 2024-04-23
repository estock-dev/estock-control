import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentData, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { Radio, Form, Input, Button, Spin, Tabs, Modal, notification, Typography } from 'antd';
import { AnyObject } from 'yup';
import Title from '../../Root/Title/Title';
import StockUpdate from '../StockUpdate/StockUpdate';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const { TabPane } = Tabs;

const EditProduct: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const handleChange = (key: string) => {
    setActiveTab(key);
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [quantityUpdate, setQuantityUpdate] = useState(0);
  const [quantityUpdateType, setQuantityUpdateType] = useState<'sale' | 'restock'>('restock');
  const [document, setDocument] = useState<DocumentData | undefined>()

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const docRef = doc(db, 'products', id!);
      const docSnap = await getDoc(docRef);
      setDocument(docSnap.data());
      if (docSnap.exists()) {
        form.setFieldsValue(docSnap.data());

      } else {
        console.log("No such document!");
        navigate('/view-products');
      }
      setIsLoading(false);
    };
    fetchProduct();
  }, [id, navigate, form]);

  const handleSave = async (values: AnyObject) => {
    await updateDoc(doc(db, 'products', id!), values);
    navigate('/view-products');
  };

  if (isLoading) {
    return <Spin tip="Loading..." size="large" />;
  }

  const handleIncrement = () => {
    setQuantityUpdate(quantityUpdate + 1);
  };

  const handleDecrement = () => {
    setQuantityUpdate(Math.max(0, quantityUpdate - 1));
  };

  return (
    <>
      <Title text='Editar produto' />
      

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
        
            {document &&
              <div style={{ display: 'flex', justifyContent: "right", alignItems: 'center', marginTop: '20px' }}>
                <Text style={{ margin: '0 16px', fontSize: '18px', textAlign: 'center' }}>Quantidade Atual: {document.qtd}</Text>
              </div>
            }
            <Form.Item
              name="marca"
              label="Marca"
              rules={[{ required: true, message: 'Please input the brand!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="modelo"
              label="Modelo"
              rules={[{ required: true, message: 'Please input the model!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nome"
              label="Nome"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="qtd"
              label="Quantidade"
              rules={[{ required: true, message: 'Please input the quantity!' }]}
            >
              
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <Button icon={<MinusCircleOutlined />} onClick={handleDecrement} />
              <Text style={{ margin: '0 16px', fontSize: '24px', minWidth: '50px', textAlign: 'center' }}>{quantityUpdate}</Text>
              <Button icon={<PlusCircleOutlined />} color="blue" onClick={handleIncrement} />
            </div>
            </Form.Item>
            <Form.Item>
              <Button type="default" onClick={() => navigate('/view-products')} style={{ marginRight: 8 }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Salvar
              </Button>
            </Form.Item>
          </Form>
        
    </>
  );
};

export default EditProduct;

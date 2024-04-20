import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { Typography, Form, Input, Button, Spin, Card } from 'antd';
import { AnyObject } from 'yup';

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const docRef = doc(db, 'products', id!);
      const docSnap = await getDoc(docRef);
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

  return (
    <Card>
      <Typography.Title level={2} style={{ marginBottom: 32 }}>
        Editar Produto
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
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
          <Input type="number" />
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
    </Card>
  );
};

export default EditProduct;

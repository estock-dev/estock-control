import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { Form, Input, Button, Spin, Card, notification } from 'antd';


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

  const handleSave = async (values: { [x: string]: [] }) => {
    try {
      await updateDoc(doc(db, 'products', id!), values);    
      navigate('/manage-stock');
      notification.success({
        message: 'Produto Atualizado',
        description: 'Os detalhes do produto foram atualizados com sucesso.',
        duration: 2.5, 
      });
    } catch (error) {  
      console.error('Error updating document:', error);
      notification.error({
        message: 'A atualização falhou',
        description: 'Ocorreu um erro ao atualizar os detalhes do produto.',
        duration: 2.5, 
      });
    }
  };

  if (isLoading) {
    return <Spin tip="Loading..." size="large" />;
  }

  return (
    <Card style={{ marginTop: 64 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item
          name="marca"
          label="Marca"
          rules={[{ required: true, message: 'Insira a marca!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="modelo"
          label="Modelo"
          rules={[{ required: true, message: 'Insira um modelo!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nome"
          label="Nome"
          rules={[{ required: true, message: 'Insira um nome!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="qtd"
          label="Quantidade"
          rules={[{ required: true, message: 'Insira uma quantidade!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={() => navigate('/manage-stock')} style={{ marginRight: 8 }}>
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

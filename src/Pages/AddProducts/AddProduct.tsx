import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select, Typography, notification } from 'antd';
import { useAppSelector, useAppDispatch } from '../../ReduxStore/hooks';
import { fetchProducts, fetchModelsForBrand } from '../../ReduxStore/Slices/productsSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Text, Title } = Typography;

const validationSchema = yup.object({
  marca: yup.string().required('Brand is required'),
  modelo: yup.string().required('Model is required'),
  nome: yup.string().required('Name is required'),
  qtd: yup.number().positive('Quantity must be positive').required('Quantity is required'),
});

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const brands = Array.from(new Set(products.map(product => product.marca)));
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      brandOption: 'existing',
      modelOption: 'existing',
      marca: '',
      modelo: '',
      nome: '',
      qtd: '',
    },
    validationSchema,
    onSubmit: async ({ brandOption, modelOption, ...values }) => {
      try {
        await addDoc(collection(db, "products"), values);
        setSubmitted(true); // Set the submitted state to true when product is added
      } catch (error) {
        console.error('Error adding product to Firestore: ', error);
      }
    },
  });

  const handleAddAnotherProduct = () => {
    formik.resetForm();
    setSubmitted(false);
  };

  const uniqueModels = Array.from(new Set(products
    .filter(product => product.marca === formik.values.marca)
    .map(product => product.modelo)
  ));

  useEffect(() => {
    if (formik.values.marca) {
      dispatch(fetchModelsForBrand(formik.values.marca));
    }
  }, [formik.values.marca, dispatch]);

  if (submitted) {
    // Feedback UI after successful submission
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>Product successfully added!</Title>
        <div>
          <Button onClick={handleAddAnotherProduct}>Add another product</Button>
          <Button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>Go to home</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <form onSubmit={formik.handleSubmit}>
        <Form.Item label="Para adicionar um novo produto, comece escolhendo uma marca ou adicione uma nova.">
          <Radio.Group
            name="brandOption"
            value={formik.values.brandOption}
            onChange={formik.handleChange}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="existing">Existing Brand</Radio.Button>
            <Radio.Button value="new">New Brand</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <div>
          {formik.values.brandOption === 'existing' ? (
            <Form.Item
              validateStatus={formik.touched.marca && formik.errors.marca ? 'error' : ''}
              help={formik.touched.marca && formik.errors.marca}
            >
              <Select
                showSearch
                placeholder="Select Brand"
                onChange={value => formik.setFieldValue('marca', value)}
              >
                {brands.map(brand => (
                  <Option key={brand} value={brand}>{brand}</Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              validateStatus={formik.touched.marca && formik.errors.marca ? 'error' : ''}
              help={formik.touched.marca && formik.errors.marca}
            >
              <Input
                placeholder="New Brand"
                name="marca"
                onChange={formik.handleChange}
                value={formik.values.marca}
              />
            </Form.Item>
          )}
          {formik.values.marca && (
            <>
              <Form.Item label="Use an existing model or add a new model?">
                <Radio.Group
                  name="modelOption"
                  value={formik.values.modelOption}
                  onChange={formik.handleChange}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="existing">Existing Model</Radio.Button>
                  <Radio.Button value="new">New Model</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {formik.values.modelOption === 'existing' ? (
                <Form.Item
                  validateStatus={formik.touched.modelo && formik.errors.modelo ? 'error' : ''}
                  help={formik.touched.modelo && formik.errors.modelo}
                >
                  <Select
                    showSearch
                    placeholder="Select Model"
                    onChange={value => formik.setFieldValue('modelo', value)}
                  >
                    {uniqueModels.map(model => (
                      <Option key={model} value={model}>{model}</Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  validateStatus={formik.touched.modelo && formik.errors.modelo ? 'error' : ''}
                  help={formik.touched.modelo && formik.errors.modelo}
                >
                  <Input
                    placeholder="New Model"
                    name="modelo"
                    onChange={formik.handleChange}
                    value={formik.values.modelo}
                  />
                </Form.Item>
              )}
            </>
          )}
          {formik.values.modelo && (
            <Form.Item
              validateStatus={formik.touched.nome && formik.errors.nome ? 'error' : ''}
              help={formik.touched.nome && formik.errors.nome}
            >
              <Input
                placeholder="Nome"
                name="nome"
                onChange={formik.handleChange}
                value={formik.values.nome}
              />
            </Form.Item>
          )}
          {formik.values.nome && (
            <Form.Item
              validateStatus={formik.touched.qtd && formik.errors.qtd ? 'error' : ''}
              help={formik.touched.qtd && formik.errors.qtd}
            >
              <Input
                placeholder="Quantity"
                name="qtd"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.qtd}
              />
            </Form.Item>
          )}
          <Button htmlType="submit" type="primary" disabled={!formik.values.nome || !formik.values.qtd}>
            Adicionar Produto
          </Button>

        </div>
      </form>
    </div>
  );
};

export default AddProduct;

import { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select, Typography } from 'antd';
import { useAppSelector, useAppDispatch } from '../../ReduxStore/hooks';
import { fetchProducts, fetchModelsForBrand } from '../../ReduxStore/Slices/productsSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { setCurrentProduct } from '../../ReduxStore/Slices/productsSlice';

const { Option } = Select;
const { Title } = Typography;

const validationSchema = yup.object({
  marca: yup.string().required('Você precisa escolher uma Marca'),
  modelo: yup.string().required('Você precisa escolher um Modelo'),
  nome: yup.string().required('Você precisa escolher um Nome'),
  qtd: yup.number().positive('Para adicionar um produto pela primeira vez, quantidade deve ser positiva e diferente de 0').required('Você precisa escolher uma Quantidade'),
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

  const checkDuplicateProduct = async (marca: string, modelo: string, nome: string) => {
    // Query Firestore to check for existing product with same marca, modelo, nome
    const querySnapshot = await getDocs(query(collection(db, "products"), where("marca", "==", marca), where("modelo", "==", modelo), where("nome", "==", nome)));
    // If any documents are found, it's a duplicate
    return !querySnapshot.empty;
  };

  const getExistingProductId = async (marca: string, modelo: string, nome: string) => {
    const querySnapshot = await getDocs(query(collection(db, "products"), where("marca", "==", marca), where("modelo", "==", modelo), where("nome", "==", nome)));
    if (!querySnapshot.empty) {
      // Assuming that there's only one product with this combination
      return querySnapshot.docs[0].id;
    }
    return null;
  };

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
      const { marca, modelo, nome } = values;
      const isDuplicate = await checkDuplicateProduct(marca, modelo, nome);

      if (isDuplicate) {
        Modal.confirm({
          title: 'Este produto já existe!',
          content: 'Você quer atualizar este produto existente ou deseja voltar à tela anterior?',
          okText: 'Atualizar Produto Existente',
          cancelText: 'Voltar à tela anterior',
          onOk: async () => {
            const existingProductId = await getExistingProductId(marca, modelo, nome);
            if (existingProductId) {
              dispatch(setCurrentProduct({ id: existingProductId }));
              navigate(`/edit-product/${existingProductId}`);
            } else {
              alert('Error on console related to the product ID');
              console.error('Product ID could not be found');
            }
          },
          onCancel: () => {

          },
        });
        return;
      }

      try {
        await addDoc(collection(db, "products"), values);
        setSubmitted(true); 
      } catch (error) {
        console.error('Erro ao adicionar o produto à base de dados: ', error);
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
        <Form.Item label="Para adicionar um novo produto, comece escolhendo uma marca ou adicione uma nova">
          <Radio.Group
            name="brandOption"
            value={formik.values.brandOption}
            onChange={formik.handleChange}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="existing">Marca Existente</Radio.Button>
            <Radio.Button value="new">Nova Marca</Radio.Button>
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
                placeholder="Selecionar Marca"
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
                placeholder="Inserir Nova Marca"
                name="marca"
                onChange={formik.handleChange}
                value={formik.values.marca}
              />
            </Form.Item>
          )}
          {formik.values.marca && (
            <>
              <Form.Item label="Quer selecionar um modelo existente ou adicionar um novo modelo?">
                <Radio.Group
                  name="modelOption"
                  value={formik.values.modelOption}
                  onChange={formik.handleChange}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="existing">Modelo Existente</Radio.Button>
                  <Radio.Button value="new">Novo Modelo</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {formik.values.modelOption === 'existing' ? (
                <Form.Item
                  validateStatus={formik.touched.modelo && formik.errors.modelo ? 'error' : ''}
                  help={formik.touched.modelo && formik.errors.modelo}
                >
                  <Select
                    showSearch
                    placeholder="Selecionar Modelo"
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
                    placeholder="Inserir Novo Modelo"
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
                placeholder="Quantidade"
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

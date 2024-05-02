import React from 'react';
import { Row, Col, Card, message } from 'antd';
import icon1 from '../../assets/menu/Atualizar2x.png';
import icon2 from '../../assets/menu/Consultar2x.png';
import icon3 from '../../assets/menu/ListaRapida2x.png';
import { useAppSelector, useAppDispatch } from '../../ReduxStore/hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchProducts } from '../../ReduxStore/Slices/productsSlice';

type MenuCardProps = {
  imageSrc: string,
  functionHolder: () => void,
};


interface GroupedData {
  [brand: string]: {
    [model: string]: string[];
  };
}

interface ProductItem {
  marca: string;
  modelo: string;
  nome: string;
  qtd?: number;
}

function capitalizeFirstLetter(string: string): string {
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function convertDataToString(data: ProductItem[]): string {
  const sortedData = [...data].sort((a, b) => {
    const brandA = a.marca.toUpperCase();
    const brandB = b.marca.toUpperCase();
    const modelA = a.modelo.toUpperCase();
    const modelB = b.modelo.toUpperCase();
    const nameA = a.nome.toUpperCase();
    const nameB = b.nome.toUpperCase();

    if (brandA < brandB) return -1;
    if (brandA > brandB) return 1;
    if (modelA < modelB) return -1;
    if (modelA > modelB) return 1;
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const groupedData: GroupedData = sortedData.reduce((acc: GroupedData, p) => {
    const brand = capitalizeFirstLetter(p.marca);
    const model = capitalizeFirstLetter(p.modelo.replace(p.marca, '').trim());
    const name = capitalizeFirstLetter(p.nome);


    if (!acc[brand]) {
      acc[brand] = {};
    }
    if (!acc[brand][model]) {
      acc[brand][model] = [];
    }
    acc[brand][model].push(name);

    return acc;
  }, {});

  let result = '';
  for (const brand in groupedData) {
    result += `--- ${brand} ---,\n`;
    for (const model in groupedData[brand]) {
      result += `Modelo: ${model}\n`;
      const names = groupedData[brand][model].join(', ');
      result += `Opções: ${names}\n\n`;
    }
    result += '\n';
  }

  return result.trim();
}

function copyToClipboard(text: string) {
  if (!text) {
    message.error('Não há dados para copiar.');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    message.success('Lista copiada para o clipboard!');
  }).catch(err => {
    console.error('Error copying to clipboard: ', err);
    message.error('Falha ao copiar para o clipboard. Tente novamente.');
  });
}



const MenuCard: React.FC<MenuCardProps> = ({ imageSrc, functionHolder }) => (

  <Card
    hoverable
    style={{
      width: 240,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
    bodyStyle={{ padding: 0 }}
    cover={<img alt="example" src={imageSrc} />}
    onClick={functionHolder}
  />
);


const Menu: React.FC = () => {
  const products = useAppSelector(state => state.products.products);
  const handleExportAll = () => {
    const productListString = convertDataToString(products);
    copyToClipboard(productListString);
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Row justify="center" align="middle" style={{
      height: '100vh',
      margin: "0 64px",
      cursor: 'pointer',

    }}>
      <Col>
        <MenuCard imageSrc={icon1} functionHolder={() => navigate('/stock-update')} />
      </Col>
      <Col>
        <MenuCard imageSrc={icon2} functionHolder={() => navigate('/view-products')} />
      </Col>
      <Col>
        <MenuCard imageSrc={icon3} functionHolder={handleExportAll} />
      </Col>
    </Row>
  )
}

export default Menu;

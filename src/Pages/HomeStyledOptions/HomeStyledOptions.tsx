import { useNavigate } from 'react-router-dom';
import { Card, List, message } from 'antd';
import iconUpdate from './../../assets/Logos/Opcao1/e-stock-logotransp.png'
import iconFetch from './../../assets/Logos/Opcao2/logotransparente.png'
import iconQuickMessage from './../../assets/Logos/Icones/message2.png'
import { useAppDispatch, useAppSelector } from '../../ReduxStore/hooks';
import { useEffect,  } from 'react';
import { fetchProducts, ProductItem } from '../../ReduxStore/Slices/productsSlice';

const solutions = [
    {
        name: 'Atualizar',
        href: '/stock-update',
        icon: IconOne,
    },
    {
        name: 'Consultar',
        href: '/view-products',
        icon: IconTwo,
    },
    {
        name: 'Lista Rápida',
        href: '',
        icon: IconThree,
    },
];

export default function HomeStyledOptions() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const products = useAppSelector(state => state.products.products);
    function convertDataToString(data: ProductItem[]): string {
        return data.map(p => `${p.marca}, ${p.modelo}, ${p.nome}, ${p.qtd}`).join('\n');
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

    const handleExportAll = () => {
        const productListString = convertDataToString(products);
        copyToClipboard(productListString);
      };


    useEffect(() => {
        dispatch(fetchProducts());
      }, [dispatch]);
    

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card bordered={false} style={{ width: '100%', maxWidth: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <List
                    itemLayout="vertical"
                    dataSource={solutions}
                    renderItem={item => (
                        <List.Item
                            onClick={
                                item.name === 'Lista Rápida' ? handleExportAll : () => navigate(item.href)}
                            style={{
                                margin: '24px',
                                padding: '20px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                            className="hoverable-list-item"
                        >
                            {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {<item.icon aria-hidden="true" />}
                            </div> */}
                            <p style={{ margin: '10px 0 0 0', fontSize: '18px', fontWeight: 'normal' }}>{item.name}</p>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}

function IconOne() {
    return <img src={iconUpdate} alt="Update Stock" style={{ maxHeight: '80px' }} />;
}

function IconTwo() {
    return <img src={iconFetch} alt="View Products" style={{ maxHeight: '80px' }} />;
}

function IconThree() {
    return <img src={iconQuickMessage} alt="Quick Message" style={{ maxHeight: '80px' }} />;
}

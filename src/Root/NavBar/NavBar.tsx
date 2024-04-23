import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../ReduxStore/hooks';
import { signOutUser } from '../../ReduxStore/Slices/authSlice';
import { Layout, Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import logo from './../../assets/Logos/Icones/logoestocksqr.png';
import logoTypo from './../../assets/Logos/Icones/e-stocklogo.png'
import logo2 from './../../assets/Logos/Opcao1/e-stock-logo.png'
import logo3 from './../../assets/Logos/Opcao1/e-stock-logo2.png'
import logo4 from './../../assets/Logos/Opcao2/logo.png'
import logo5 from './../../assets/Logos/Opcao2/logotransparente.png'
import logo6 from './../../assets/Logos/Opcao3/logobrancotransparente.png'
import logo7 from './../../assets/Logos/Opcao3/logogradiente.png'
import logo8 from './../../assets/Logos/Opcao3/logoroxobranco.png'
import logo9 from './../../assets/Logos/Opcao3/logotransparente.png'
import logo10 from './../../assets/Logos/Opcao4/logo.png'
import logo11 from './../../assets/Logos/Opcao5/logo.png'
import logo12 from './../../assets/Logos/Opcao6/log.png'
import logo13 from './../../assets/Logos/Opcao6/logo.png'
import logo14 from './../../assets/Logos/Opcao6/logovermelha.png'
import logo15 from './../../assets/Logos/Opcao7/logofundoroxo.png'
import logo16 from './../../assets/Logos/Opcao7/logoroxo2.png'
import logo17 from './../../assets/Logos/Opcao7/logotransparente.png'

const { Header } = Layout;
const { Text, Link } = Typography;

const NavBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.auth.authenticated);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(signOutUser());
    };

    const goHome = () => {
        navigate('/home');
    };

    const shouldShowBackButton = ['/view-products', '/add-product', '/edit-product', '/stock-update'].some(
        path => location.pathname === path || location.pathname.startsWith(`${path}/`)
    );

    return (
        <Header style={{ backgroundColor: '#17123f', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: "94px", margin: "auto"  }}>
            <Link href='/home' style={{ color: 'white', fontSize: '16px' }}>
                <img src={logo17} style={{  maxHeight: "48px", maxWidth: "64px", marginLeft: "17px", paddingRight: 3 }} />
                <img src={logoTypo} style={{ maxHeight: "128", maxWidth: "128px", marginLeft: "px" }} />
                
            </Link>
            

            {isAuthenticated && (
                <Space>
                    {shouldShowBackButton && (
                        <>
                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={goHome}>
                                Voltar
                            </Button>
                            <div style={{ backgroundColor: 'white', width: '2px', height: '35px', margin: '0 8px' }} />
                        </>
                    )}
                    <Button type="text" onClick={handleLogout}>
                        Sair da Conta
                    </Button>
                </Space>
            )}
        </Header>
    );
};

export default NavBar;

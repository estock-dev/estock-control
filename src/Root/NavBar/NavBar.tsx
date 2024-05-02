import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../ReduxStore/hooks';
import { signOutUser } from '../../ReduxStore/Slices/authSlice';
import { Layout, Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
const { Header } = Layout;
const { Link } = Typography;

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
        <Header style={{ backgroundColor: 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: "94px", margin: "auto" }}>
            <Link href='/home' style={{ color: 'white', margin: "32px", background: "transparent", fontWeight: 400, fontSize: "16px" }}>
                e-stock
            </Link>


            {isAuthenticated && (
                <Space>
                    {shouldShowBackButton && (
                        <>
                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={goHome}>
                                Voltar
                            </Button>
                            <div style={{ backgroundColor: 'transparent', width: '2px', height: '35px', margin: '0 8px' }} />
                        </>
                    )}
                    <Link onClick={handleLogout} style={{ color: 'white', margin: "32px", background: "transparent", fontWeight: 400 }}>
                        logout
                    </Link>

                </Space>
            )}
        </Header>
    );
};

export default NavBar;

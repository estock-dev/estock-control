// NavBar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../ReduxStore/hooks';
import { signOutUser } from '../../ReduxStore/Slices/authSlice';
import { Layout, Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Link } = Typography;

interface NavBarProps {
  toggleCollapsed?: () => void;
  collapsed?: boolean;
}

const Nav: React.FC<NavBarProps> = () => {
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
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0, backgroundColor: 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: "64px", border: "1px solid blue" }}>
      <Space style={{ border: "1px solid green", maxWidth: 144, justifyContent: "center"}}>
      <Link href='/home' style={{ color: 'white', margin: "16px", background: "transparent", fontWeight: 400, fontSize: "16px" }}>
          e-stock
        </Link>
      </Space>

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
          <Link href='/home' style={{ color: 'white', margin: "32px", background: "transparent", fontWeight: 400, fontSize: "16px" }}>
            logout
          </Link>
        </Space>
      )}
    </Header>
  );
};

export default Nav;

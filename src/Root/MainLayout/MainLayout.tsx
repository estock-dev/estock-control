import { ReactNode } from 'react';
import { useState } from 'react';
import {
  HomeOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  ScheduleOutlined,
  FileSearchOutlined,
  FileSyncOutlined,
  DatabaseOutlined,
  AppstoreAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Divider, Layout, Menu, Space, Modal } from 'antd';
import Link from 'antd/es/typography/Link';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './MainLayout.css';
import { useAppDispatch } from '../../ReduxStore/hooks';
import useMobileDetect from '../Utility/CustomHooks/UseMobileDetect/useMobileDetect';
import ExportProducts from '../../ReduxStore/ExportProducts/ExportProducts';
import logo from '../../assets/Logos/E.png';
import logocompleta from '../../assets/Logos/EST.png';
import { signOutUser } from '../../ReduxStore/Slices/authSlice';
import { Tooltip } from 'antd';



const { Header, Sider, Content  } = Layout;

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useMobileDetect();
  const [collapsed, setCollapsed] = useState(false);
  const renderTooltip = (title: string, component: ReactNode): ReactNode => {
    return collapsed ? <Tooltip title={title}>{component}</Tooltip> : component;
  };
  const confirmLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      onOk() {
        dispatch(signOutUser());
        navigate('/login');
      }
    });
  };

  const mobileMenuItems = [
    { key: 'home', icon: <HomeOutlined />, onClick: () => navigate('/home') },
    {
      key: 'stock', icon: renderTooltip('Estoque', <DatabaseOutlined />), children: [
        { key: '4', icon: renderTooltip('Gerenciar', <FileSearchOutlined />), label: 'Gerenciar', onClick: () => navigate('/manage-stock') },
        { key: '5', icon: renderTooltip('Adicionar Produto', <AppstoreAddOutlined />), label: 'Adicionar Produto', onClick: () => navigate('/add-product') },
        { key: '6', icon: renderTooltip('Gerar Lista', <ScheduleOutlined />), label: 'Gerar Lista', onClick: () => navigate('/list-export') },
      ]
    },
    {
      key: 'actions', icon: renderTooltip('Ações Rápidas', <ThunderboltOutlined />),
      children: [
        { key: '2', icon: renderTooltip('Atualizar Quantidade', <FileSyncOutlined />), label: 'Atualizar Quantidade', onClick: () => navigate('/stock-update') },
        { key: '3', icon: renderTooltip('Exportar Lista Completa', <MessageOutlined />), label: <ExportProducts />, style: { cursor: 'pointer' } },
      ]
    },
    { key: 'logout', icon: renderTooltip('Atualizar Quantidade', <UserOutlined />), onClick: confirmLogout }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile ? (
        <>
          <Header style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: "transparent", }}>
            <Link href='/home'>
              <img src={logo} alt="Logo" style={{ display: 'flex', width: 30, margin: '0 24px' }} />
            </Link>
            <Menu mode="horizontal" items={mobileMenuItems} style={{ width: '100%', display: "flex", justifyContent: "right", background: "transparent" }} />
          </Header>
          <Layout style={{ transition: 'margin 0.2s', minWidth: '320px' }}> {/* Set a minimum width for smaller devices */}
            <Content style={{ margin: '24px 16px', padding: 24, background: "transparent", minHeight: 280 }}>
              <Outlet />
            </Content>
          </Layout>
        </>
      ) : (
        <>
          <Sider trigger={null} width={256} collapsedWidth={80} collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ background: "transparent", position: "fixed", left: 0, top: 0, bottom: 0 }}>
            <Space style={collapsed ? { marginTop: "18px", marginBottom: '24px', display: 'flex', justifyContent: 'center', width: '100%' } : { display: 'flex', justifyContent: 'left', width: '100%', marginTop: "18px", marginBottom: '24px', }}>
              <Link href='/home'>
                <img src={collapsed ? logo : logocompleta} alt="Logo" style={collapsed ? { display: 'block', width: 30, margin: 24 } : { display: 'block', width: 128, margin: 32 }} />
              </Link>
            </Space>
            <Divider />
            <Menu style={{ background: "transparent", flex: 1 }} mode="inline" items={[
              { key: '1', icon: <HomeOutlined />, label: 'Home', onClick: () => navigate('/home') },
              {
                key: 'sub3',
                label: 'Estoque',
                icon: <DatabaseOutlined />,
                children: [
                  { key: '4', icon: <FileSearchOutlined />, label: 'Gerenciar', onClick: () => navigate('/manage-stock') },
                  { key: '5', icon: <AppstoreAddOutlined />, label: 'Adicionar Produto', onClick: () => navigate('/add-product') },
                  { key: '6', icon: <ScheduleOutlined />, label: 'Gerar Lista', onClick: () => navigate('/list-export') },
                ],
              },
              {
                key: 'sub4',
                label: 'Ações Rápidas',
                icon: <ThunderboltOutlined />,
                children: [
                  { key: '2', icon: <FileSyncOutlined />, label: 'Atualizar Quantidade', onClick: () => navigate('/stock-update') },
                  { key: '3', icon: renderTooltip('Atualizar Quantidade', <MessageOutlined />), label: <ExportProducts />, style: { cursor: 'pointer' } },
                ],
              },
              {
                key: 'logout',
                icon: <UserOutlined />,
                label: 'Logout',
                style: { position: 'absolute', bottom: 0, width: '100%' },
                onClick: confirmLogout,
              }

            ]} />
          </Sider>

          <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin 0.2s', minWidth: '320px' }}>
            <Header style={{ padding: 0, background: "transparent" }}>
              <Button
                type="text"
                icon={collapsed ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </Header>
            <Content style={{ margin: '24px 16px', padding: 24, background: "transparent", minHeight: 280 }}>
              <Outlet />
            </Content>
          </Layout>
        </>
      )}

    </Layout>
  );
};

export default MainLayout;

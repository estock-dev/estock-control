import { ReactNode, useEffect } from 'react';
import {
  HomeOutlined, ThunderboltOutlined,
  MessageOutlined, ScheduleOutlined, FileSearchOutlined, FileSyncOutlined,
  DatabaseOutlined, AppstoreAddOutlined, UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Modal, Tooltip } from 'antd';
import Link from 'antd/es/typography/Link';
import { Outlet, useNavigate } from 'react-router-dom';
import './MainLayout.css';
import { useAppDispatch } from '../../ReduxStore/hooks';
import useMobileDetect from '../Utility/CustomHooks/UseMobileDetect/useMobileDetect';
import ExportProducts from '../../ReduxStore/ExportProducts/ExportProducts';
import logo from '../../assets/Logos/E.png';
import { signOutUser } from '../../ReduxStore/Slices/authSlice';
import useSessionTimeout from '../../ReduxStore/Slices/useSessionTimeout';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useMobileDetect();
  const { setSessionStartTime } = useSessionTimeout();

  useEffect(() => {
    setSessionStartTime();
  }, [setSessionStartTime]);

  const renderTooltip = (component: ReactNode): ReactNode => {
    return <Tooltip>{component}</Tooltip>;
  };
  const renderTooltipExportAll = (component: ReactNode): ReactNode => {
    return <Tooltip style={{ padding: "12px" }} title='Exportar Lista Completa'><MessageOutlined style={{ paddingLeft: 2 }} /> {component}</Tooltip>;
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
    { key: 'home', icon: <HomeOutlined />, label: 'Home', onClick: () => navigate('/home') },
    {
      key: 'stock', icon: <DatabaseOutlined />, label: "Estoque",
      children: [
        { key: '4', icon: <FileSearchOutlined />, label: 'Gerenciar', onClick: () => navigate('/manage-stock') },
        { key: '5', icon: <AppstoreAddOutlined />, label: 'Adicionar Produto', onClick: () => navigate('/add-product') },
        { key: '6', icon: <ScheduleOutlined />, label: 'Gerar Lista', onClick: () => navigate('/list-export') },
      ]
    },
    {
      key: 'actions', icon: <ThunderboltOutlined />, label: 'Ações Rápidas',
      children: [
        { key: '2', icon: <FileSyncOutlined />, label: 'Atualizar Quantidade', onClick: () => navigate('/stock-update') },
        { key: '3', icon: renderTooltipExportAll(<ExportProducts />), style: { cursor: 'pointer' } },
      ]
    },
    { key: 'logout', icon: <UserOutlined />, label: "Logout", onClick: confirmLogout }
  ];

  return (

    <Layout style={{ minHeight: '100vh' }}>

      <>
        <Header style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: "transparent" }}>
          <Link href='/home'>
            <img src={logo} alt="Logo" style={{ display: 'flex', width: 30, margin: '0 24px' }} />
          </Link>
          <Menu mode="horizontal" items={mobileMenuItems} style={{ width: '100%', display: "flex", justifyContent: "right", alignItems: "center", background: "transparent" }} />
        </Header>
        <Layout style={{ transition: 'transition: all 1s ease-out', minWidth: '320px' }}>
          <Content style={{ margin: '24px 16px', padding: 24, background: "transparent", minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </>

    </Layout>
  );
};

export default MainLayout;

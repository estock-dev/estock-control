import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '1', icon: <PieChartOutlined />, label: 'Home' },
  {
    key: 'sub1',
    label: 'Ações Rápidas',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', icon: <DesktopOutlined />, label: 'Atualizar Quantidade' },
      { key: '6', icon: <DesktopOutlined />, label: 'Lista Rápida' },
    ],
  },
  {
    key: 'sub2',
    label: 'Estoque',
    icon: <MailOutlined />,
    children: [
      { key: '2', icon: <DesktopOutlined />, label: 'Gerenciar' },
      { key: '3', icon: <ContainerOutlined />, label: 'Adicionar Produto' },
      { key: '1', icon: <PieChartOutlined />, label: 'Gerar Lista' },
    ],
  },

];

const SideNav: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ width: 256 }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, maxWidth: "144" }}
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default SideNav;
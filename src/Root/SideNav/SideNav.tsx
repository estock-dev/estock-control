import React from 'react';
import { Menu, Collapse } from 'antd';

const { Panel } = Collapse;

const SideNav: React.FC = () => {
    return (
        <div style={{ width: 200, minHeight: '100vh', background: '#f0f2f5' }}>
            <Collapse bordered={false} defaultActiveKey={['1']}>
                <Panel header="Atualizar estoque" key="1">
                    <Menu mode="inline" theme="light">
                        <Menu.Item key="1">Atualizar produto</Menu.Item>
                        <Menu.Item key="2">Adicionar novo produto</Menu.Item>
                    </Menu>
                </Panel>
                <Panel header="Consultar estoque" key="2">
                    <Menu mode="inline" theme="light">
                        <Menu.Item key="3">Option 3</Menu.Item>
                        <Menu.Item key="4">Option 4</Menu.Item>
                    </Menu>
                </Panel>
            </Collapse>
        </div>
    );
};

export default SideNav;

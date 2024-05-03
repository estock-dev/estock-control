import React from 'react';
import { Button, Typography, Layout } from 'antd';
import ActionButtons from '../../Root/ActionButtons/ActionButtons';
const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  return (
    <Content style={{ margin: '24px 16px', padding: 24, background: 'transparent', minHeight: 280, display: 'flex', flexDirection: "column", justifyContent: "center" }}>
      
      <Paragraph style={{ color: 'white' }}>
        O que deseja fazer hoje?
      </Paragraph>
      
      <ActionButtons/>
    </Content>
  );
};

export default Home;

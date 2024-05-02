import React from 'react';
import { Button, Typography, Layout } from 'antd';
const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  return (
    <Content style={{ margin: '24px 16px', padding: 24, background: 'transparent', minHeight: 280 }}>
      <Title style={{ color: 'white' }} level={2}>Bem-vinda ao e-stock!</Title>
      <Paragraph style={{ color: 'white' }}>
        O que deseja fazer hoje?
      </Paragraph>
      <Button type="primary" style={{ marginTop: '16px' }}></Button>
    </Content>
  );
};

export default Home;

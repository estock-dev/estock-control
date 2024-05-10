import React from 'react';
import { Typography, Layout } from 'antd';
import ActionButtons from '../../Root/ActionButtons/ActionButtons';
import StrangeloveButton from '../../Root/StrangeloveButton/StrangeloveButton';

const { Paragraph } = Typography;
const { Content } = Layout;

const Home: React.FC = () => {
  return (
    <Layout style={{ position: 'relative', height: '100%' }}>
      <Content style={{ margin: '24px 16px', padding: 24, background: 'transparent', minHeight: 280, display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <ActionButtons />
      </Content>
      <div style={{ position: 'absolute', right: 30, bottom: 30 }}>
        <StrangeloveButton />
      </div>
    </Layout>
  );
};

export default Home;

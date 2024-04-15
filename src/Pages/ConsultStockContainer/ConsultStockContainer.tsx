import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Outlet } from 'react-router-dom';
import GenMessage from '../GenMessage/GenMessage';

const { TabPane } = Tabs;

const ConsultStockContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');

  const handleChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: 360 }}>
      <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handleChange}>
        <TabPane tab="Tab 3" key="1">
          <Outlet context={{ tab: 'Tab 1' }} />
          
          <div>
            <h1>Content of Tab 3</h1>
            <GenMessage/>
          </div>
        </TabPane>
        <TabPane tab="Tab 4" key="2">
          <Outlet context={{ tab: 'Tab 2' }} />
          
          <div>
            <h1>Content of Tab 4</h1>
            <p>This is the content section for Tab 2.</p>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ConsultStockContainer;

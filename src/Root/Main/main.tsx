import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from '../../ReduxStore/store';  // Adjust the import path as necessary
import { PersistGate } from 'redux-persist/integration/react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import AuthObserver from '../../ReduxStore/Slices/AuthObserver';
import App from '../App/App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);  
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthObserver />
          <ConfigProvider
            theme={{
              "token": {
                "colorPrimary": "#722ed1",
                "colorInfo": "#722ed1",
                "colorBgBase": "transparent",
                "colorTextBase": "#ffffff",
                "fontFamily": "'Saira', sans-serif",
                "fontSize": 14,
                "sizeStep": 5,
                "borderRadius": 14,
                "colorLink": "#fa8c16",
                "wireframe": true,
                "colorPrimaryBg": "rgb(0, 0, 0)",
                "colorPrimaryBgHover": "#eb2f96",
                "colorPrimaryBorder": "#ffffff",
                "colorBgLayout": "linear-gradient(180deg, rgb(0, 0, 0) 0%, rgb(69, 53, 117) 100%)",
              }
            }}
          >
            <App />
          </ConfigProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}

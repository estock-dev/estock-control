import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from '../../ReduxStore/store';
import { PersistGate } from 'redux-persist/integration/react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from '../Context/UserProvider'
import App from '../App/App';
import { ConfigProvider, theme } from 'antd';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <UserProvider>
            <ConfigProvider
              theme={{
                  "token": {
                    "colorPrimary": "#722ed1",
                    "colorInfo": "#722ed1",
                    "colorBgBase": "#17123f",
                    "colorTextBase": "#ffffff",
                    "fontFamily": "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;",
                    "fontSize": 12,
                    "sizeStep": 5,
                    "borderRadius": 14,
                    "colorLink": "#fa8c16",
                    "wireframe": true,
                    "colorPrimaryBg": "#b47fd2",
                    "colorPrimaryBgHover": "#eb2f96",
                    "colorPrimaryBorder": "#ffffff"
                  },
                algorithm: theme.darkAlgorithm
              }}>
              <App />
            </ConfigProvider>
          </UserProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>,
  );
}

// import React from 'react';
// import { Switch, Menu, Divider, Button, Row, Col, message as antdMessage } from 'antd';
// import { motion } from 'framer-motion';
// import { useAppDispatch, useAppSelector } from './../../../ReduxStore/hooks';
// import { setFormattedMessage, setSelectedKey, toggleQuantityIncluded } from '../../../ReduxStore/Slices/productsSlice';

// const FullList: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const products = useAppSelector((state) => state.products.products);
//   const includeQuantity = useAppSelector((state) => state.products.includeQuantity);
//   const selectedKey = useAppSelector((state) => state.products.selectedKey);
//   const formattedMessage = useAppSelector((state) => state.products.formattedMessage);

//   // Handling the menu item selection
//   const handleMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     const key = e.currentTarget.getAttribute('data-key');
//     if (key) {
//       dispatch(setSelectedKey(key));
//     }
//   };

//   // Handling the switch toggle
//   const handleSwitchChange = (checked: boolean) => {
//     dispatch(toggleQuantityIncluded()); // Now it does not require an argument
//   };
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text).then(
//       () => antdMessage.success('Texto copiado! Agora é só colar onde quiser'),
//       () => antdMessage.error('A cópia do texto falhou :( Por favor, tente novamente.')
//     );
//   };

//   return (
//     <Row>
//       <Col span={6}>
//         <Menu mode="vertical" selectedKeys={[selectedKey]}>
//           <Menu.Item key="marcas" data-key="marcas" onClick={() => handleMenuClick}>
//             Marcas
//           </Menu.Item>
//           <Menu.Item key="modelos" data-key="modelos" onClick={() => handleMenuClick}>
//             Modelos
//           </Menu.Item>
//           <Menu.Item key="details" data-key="details" onClick={() => handleMenuClick}>
//             Produtos Detalhados
//           </Menu.Item>
//         </Menu>
//         {selectedKey === 'details' && (
//           <div style={{ padding: '16px', paddingTop: '24px' }}>
//             <Switch
//               checkedChildren="Quantidade incluída"
//               unCheckedChildren="Clique para incluir quantidade"
//               checked={includeQuantity}
//               onChange={handleSwitchChange}
//             />
//           </div>
//         )}
//         <Divider />
//       </Col>
//       <Col span={18}>
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           style={{ overflow: 'auto' }}
//         >
//           <pre>{formattedMessage}</pre>
//         </motion.div>
//         {formattedMessage && (
//           <Button onClick={() => copyToClipboard(formattedMessage)}>
//             COPIAR MENSAGEM
//           </Button>
//         )}
//       </Col>
//     </Row>
//   );
// };

// export default FullList;

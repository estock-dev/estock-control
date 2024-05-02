import React from 'react';
import { Row, Col, Typography } from 'antd';
import useMobileDetect from '../Utility/CustomHooks/UseMobileDetect/useMobileDetect';
import styles from './ActionButtons.module.css';

const { Title, Paragraph } = Typography;

const cardData = [
  { id: 1, text: 'Atualizar Quantidade', description: 'Fiz uma venda? Reabasteceu um produto? Atualize seu estoque rapidamente!' },
  { id: 2, text: 'Exportar Listas', description: 'Exporte listas personalizadas para atender seus clientes!' },
  { id: 3, text: 'Adicionar Produto', description: 'Adicione seus produtos recém-chegados' },
  { id: 4, text: 'Gerenciar Estoque', description: 'Consulte e edite seus produtos' },
  { id: 5, text: 'Lista Rápida', description: 'Exporte o estoque disponível em 1 clique' }
];

const ActionButtons: React.FC = () => {
  const isMobile = useMobileDetect();

  return (
    <Row gutter={[16, 16]} style={{ width: '100%' }}>
      {cardData.map((card) => (
        <Col key={card.id} span={isMobile ? 24 : 8}>
          <div className={styles.card}>
            <div className={styles.content}>
              <Title level={4} style={{ color: 'white', marginBottom: 5 }}>{card.text}</Title>
              <Paragraph style={{ color: 'white', fontSize: '14px' }}>{card.description}</Paragraph>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default ActionButtons;

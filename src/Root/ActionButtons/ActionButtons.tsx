import React from 'react';
import styles from './ActionButtons.module.css';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const ActionButtons: React.FC = () => {
    const navigate = useNavigate()
    const cardData = [
        { id: 1, text: 'Gerenciar Estoque', onClickHandler: () => navigate('/manage-stock')},
        { id: 2, text: 'Atualizar Quantidade', onClickHandler: () => navigate('/stock-update')},
        { id: 3, text: 'Exportar Listas Customizadas', onClickHandler: () => navigate('/list-export')},
        { id: 4, text: 'Adicionar Novo Produto', onClickHandler: () => navigate('/add-product')},
    ];
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'left', marginTop: 30 }}>
            {cardData.map(card => (
                <div onClick={card.onClickHandler} key={card.id} className={styles.card}>
                    <Typography>
                        <p className={styles.menu__link}>
                            {card.text}
                        </p>
                    </Typography>

                </div>
            ))}
        </div>
    );
};

export default ActionButtons;

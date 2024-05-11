import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
const InvisibleButton: React.FC = () => {
    const buttonStyle = {
        opacity: 0,
        transition: 'opacity 0.5s ease',
    };
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/strangelove")
    };

    return (
        <div style={{ height: '50px', width: '200px', margin: '20px' }}>
            <Button
                type="primary"
                style={buttonStyle}
                onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '1';
                }}
                onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '0';
                }}
                onClick={handleClick}
            >

                Outras Ações
            </Button>
        </div>
    );
};

export default InvisibleButton;

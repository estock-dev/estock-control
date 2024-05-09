import React from 'react';
import './StrangeloveButton.css';
import { useNavigate } from 'react-router-dom';

const StrangeloveButton: React.FC = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/strangelove")
    };

    return (
        <div className="light-button">
            <button className="bt" onClick={handleClick}>
                <div className="light-holder">
                    <div className="dot"></div>
                    <div className="light"></div>
                </div>
                <div className="button-holder">
                    <p>Strangelove</p>
                </div>
            </button>
        </div>
    );
}

export default StrangeloveButton;

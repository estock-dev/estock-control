import React from 'react';
import './Title.css';

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <div className="title-container">
      <h2 className="title-text">{text}</h2>
      <hr className="title-underline" />
    </div>
  );
};

export default Title;

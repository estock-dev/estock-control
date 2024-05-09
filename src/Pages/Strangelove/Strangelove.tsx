import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Strangelove: React.FC = () => {
  const [password, setPassword] = useState<string>('');  
  const navigate = useNavigate();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const input: string = event.target.value;
    setPassword(input);

    if (input === 'ope') {
      navigate('/beyond-strangelove');
    }
  };

  return (
    <div>
        <h1>tell me the code and I'll let you pass</h1>
        <input 
          type="password"
          value={password}
          onChange={handlePasswordChange}  
        />
    </div>
  );
}

export default Strangelove;

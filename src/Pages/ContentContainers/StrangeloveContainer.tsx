import React, { useState } from 'react';
import BeyondStrangelove from '../Strangelove/BeyondStrangelove';

const StrangeloveContainer: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [deleteAllAuthorized, setDeleteAllAuthorized] = useState<boolean>(false)

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input: string = event.target.value;
        setPassword(input);

        if (input === 'ope') {
            setDeleteAllAuthorized(true)
        }
    };

    return (
        <>
            {
                deleteAllAuthorized ? (
                    <BeyondStrangelove />
                ) : (
                    <div>
                        <h1>tell me the code and I'll let you pass</h1>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div >
                )
            }
        </>
    )
}

export default StrangeloveContainer;

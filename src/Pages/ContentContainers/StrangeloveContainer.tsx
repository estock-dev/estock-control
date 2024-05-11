import React, { useState } from 'react';
import BeyondStrangelove from '../BeyondStrangelove/BeyondStrangelove';

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
                    <div style={{ width: "100%", height: "100vh"}}>
                    <BeyondStrangelove />
                    </div>
                ) : (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                        height: "100%",
                        padding: "20px"
                    }}>
                        <h1>
                            insira a chave de acesso
                        </h1>
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

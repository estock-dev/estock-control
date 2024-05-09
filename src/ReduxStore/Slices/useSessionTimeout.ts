import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from './authSlice'

const SESSION_TIMEOUT = 600000; 

const useSessionTimeout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleTimeout = () => {
            const sessionStartTime = localStorage.getItem('sessionStartTime');
            const now = new Date().getTime();

            if (sessionStartTime && (now - parseInt(sessionStartTime, 10) > SESSION_TIMEOUT)) {
                localStorage.removeItem('sessionStartTime');
                dispatch(signOut());
            }
        };

        handleTimeout();
        const intervalId = setInterval(handleTimeout, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, [dispatch]);

    const setSessionStartTime = () => {
        const startTime = new Date().getTime();
        localStorage.setItem('sessionStartTime', startTime.toString());
    };

    return { setSessionStartTime };
};

export default useSessionTimeout;

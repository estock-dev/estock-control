import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../Configuration/firebase';
import { setUser, signOut } from './authSlice'

const AuthObserver = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                dispatch(setUser({
                    uid: user.uid,
                    email: user.email,  
                }));
            } else {
                dispatch(signOut());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return null;  
};

export default AuthObserver;

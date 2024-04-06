import React, { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './userContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '../../ReduxStore/Slices/authSlice'
import { User } from '../../Types/user'

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(currentUser);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const handleSetUser = (userData: User | null) => {
    if (userData) {
        // This will update the Redux state and, optionally, your Firestore database
        dispatch(updateUser(userData));
    } else {
        // Handle the case when userData is null, if necessary
    }
    setUser(userData); // Update local state
};

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
};

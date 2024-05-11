import React, { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './userContext';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../ReduxStore/Slices/authSlice'
import { User } from '../../Types/user'

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser);
  const [user, setUser] = useState<User | null>(currentUser);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);



  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export interface User {
  id: string
  name: string
  surname: string
  username: string
  email: string
  token: string
  avatar: string
}

export interface Auth {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  logout: () => void
  isAuth: boolean
}

const UserContext = createContext<Auth>({} as Auth);

export function useAuth() {
  return useContext(UserContext);
}

interface UserProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: UserProviderProps) {
  
  const [user, setUser] = useState<User | null>(null);

  const isAuth = useMemo(() => Boolean(user?.token && user.token !== ''), [user]);
  
  function logout() {
    setUser(null);
    localStorage.removeItem('token');
  }

  const store = useMemo(() => ({ user, setUser, logout, isAuth }), [user, setUser, isAuth]);

  return (
    <UserContext.Provider value={store}>
      {children}
    </UserContext.Provider>
  );
}


import { gql, useQuery } from '@apollo/client';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { MeQuery } from '../__generated__/MeQuery';

export interface User {
  id: string
  name: string
  surname: string
  username: string
  email: string
  token: string
  avatar: string
}

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      name
      surname
      email
      username
      avatar
    }
  }
`;

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

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<User | null>(null);

  const token = typeof window !== 'undefined' && localStorage.getItem('token');  
  
  useQuery<MeQuery>(ME_QUERY, {
    context: {
      headers: {
        authorization: token || ''
      }
    },
    onCompleted: ({ me }) => {
      setUser({
        ...me,
        token: localStorage.getItem('token')
      });
    }
  });
  
  function logout() {
    setUser(null);
    localStorage.removeItem('token');
  }

  const store = useMemo(() => ({ 
    user, 
    setUser, 
    logout, 
    isAuth: Boolean(user?.token && user.token !== '') 
  }), [user, setUser]);

  return (
    <UserContext.Provider value={store}>
      {children}
    </UserContext.Provider>
  );
}


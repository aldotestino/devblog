import { gql, useMutation, useQuery } from '@apollo/client';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { LogoutMutation } from '../__generated__/DeleteProfileMutation';
import { LoginMutation_user } from '../__generated__/LoginMutation';
import { MeQuery } from '../__generated__/MeQuery';

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

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

export interface Auth {
  user: LoginMutation_user | null
  setUser: React.Dispatch<React.SetStateAction<LoginMutation_user | null>>
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

  const [user, setUser] = useState<LoginMutation_user | null>(null);

  const [logout] = useMutation<LogoutMutation>(LOGOUT_MUTATION, {
    onCompleted: ({ logout }) => {
      if(logout) {
        setUser(null);
      }
    }
  });
  
  useQuery<MeQuery>(ME_QUERY, {
    onCompleted: ({ me }) => {
      setUser(me);
    }
  });

  const store = useMemo(() => ({ 
    user, 
    setUser, 
    logout, 
    isAuth: Boolean(user) 
  }), [user, setUser]);

  return (
    <UserContext.Provider value={store}>
      {children}
    </UserContext.Provider>
  );
}


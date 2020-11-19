import { useRouter } from 'next/router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import usePersistedState from '@/utils/hooks/usePersistedState';

import api from '../services/api';

type Role = 'admin' | 'manager' | 'moderator' | 'vip';

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default interface ISession {
  user: IUser;
  access_token: string;
  refresh_token: string;
}

type ICreateSessionResponse = ISession;

interface ISignInCredentials {
  email: string;
  password: string;
}

interface IAuthenticationContextData {
  user?: IUser;
  isLoggedIn(): boolean;
  logIn(credentials: ISignInCredentials): Promise<void>;
  logOut(): void;
}

const AuthenticationContext = createContext<IAuthenticationContextData>(
  {} as IAuthenticationContextData,
);

const AuthenticationProvider: React.FC = ({ children }) => {
  const [data, setData] = usePersistedState<ISession>('session', null);

  const router = useRouter();

  const isLoggedIn = useCallback(() => !!data?.access_token, [data]);

  const logIn = useCallback(
    async ({ email, password }: ISignInCredentials) => {
      const response = await api.post<ICreateSessionResponse>('/sessions', {
        email,
        password,
      });

      setData(response.data);
    },
    [setData],
  );

  const logOut = useCallback(() => {
    setData(null);

    router.replace('/login');
  }, [setData]);

  useEffect(() => {
    const route = router.asPath;

    const isRoute = (name: string) => route.split('?')[0] === name;

    if (!isLoggedIn()) {
      if (!isRoute('/login')) {
        router.replace('/login');
      }

      return;
    }

    if (isRoute('/') || isRoute('/login') || isRoute('/app')) {
      router.replace('/register/cemeteries');
      return;
    }

    api.get<IUser>('profile').then(response => {
      setData({
        ...data,
        user: response.data,
      });
    });
  }, [router]);

  return (
    <AuthenticationContext.Provider
      value={{
        user: data?.user,
        isLoggedIn,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

function useAuthentication(): IAuthenticationContextData {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "'useAuthentication' must be used within an 'AuthenticationProvider'",
    );
  }

  return context;
}

export { AuthenticationProvider, useAuthentication };

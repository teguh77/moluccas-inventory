import { createContext, useContext, useEffect, useReducer } from 'react';
import Axios from 'axios';
import { ChildrenProps } from '@/lib/types';

type User = {
  userId: string;
  username: string;
  fullname: string;
  role: string;
  id: string;
};

type TState = {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
};

const StateContext = createContext<TState>({
  authenticated: false,
  user: null,
  loading: true,
});

type AuthContext = (type: string, payload?: any | null) => void;

const DispatchContext = createContext<AuthContext | null>(null);

const reducer = (state: TState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload = null) => {
    defaultDispatch({ type, payload });
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await Axios.get('/api/auth/me');
        dispatch('LOGIN', res.data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } finally {
        dispatch('STOP_LOADING');
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);

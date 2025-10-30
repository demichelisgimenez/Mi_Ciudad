import React, { useEffect, useReducer } from "react";
import { AuthContext } from "./auth-context";
import { AUTH_ACTIONS } from "./enums";
import { deleteUser, setUser } from "@utils/secure-store";
import { supabase } from "@utils/supabase";
import type { IUser } from "@shared/models";

interface Action {
  type: AUTH_ACTIONS;
  payload?: any;
}

interface State {
  isLoading: boolean;
  token: string | null;
  user: IUser | null;
  refreshToken: string | null;
}

const initialState: State = {
  isLoading: true,
  token: null,
  user: null,
  refreshToken: null,
};

function mapSupabaseUserToIUser(sUser: any): IUser {
  return {
    id: sUser?.id ?? "",
    email: sUser?.email ?? "",
    nombre: sUser?.user_metadata?.nombre ?? "",
    apellido: sUser?.user_metadata?.apellido ?? "",
  } as IUser;
}

const reducer = (prevState: State, action: Action): State => {
  const { payload } = action || {};
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN: {
      const user = payload?.user as IUser | null;
      const token = payload?.token ?? null;
      const refreshToken = payload?.refreshToken ?? null;
      if (user) setUser(user);
      return { ...prevState, user, token, refreshToken };
    }
    case AUTH_ACTIONS.SET_USER: {
      const user = payload?.user as IUser | null;
      if (user) setUser(user);
      return { ...prevState, user };
    }
    case AUTH_ACTIONS.SET_TOKEN: {
      return {
        ...prevState,
        token: payload?.token ?? null,
        refreshToken: payload?.refreshToken ?? null,
      };
    }
    case AUTH_ACTIONS.LOGOUT: {
      deleteUser();
      return { ...initialState, isLoading: false };
    }
    case AUTH_ACTIONS.SET_LOADING: {
      return { ...prevState, isLoading: !!payload?.isLoading };
    }
    case AUTH_ACTIONS.SET_ASSETS_LOADING: {
      return { ...prevState, isLoading: !!payload?.isLoading };
    }
    default:
      return prevState;
  }
};

const AuthProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const session = data.session;
      if (session?.user) {
        const u = mapSupabaseUserToIUser(session.user);
        dispatch({
          type: AUTH_ACTIONS.LOGIN,
          payload: {
            user: u,
            token: session?.access_token ?? null,
            refreshToken: session?.refresh_token ?? null,
          },
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { isLoading: false } });
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = mapSupabaseUserToIUser(session.user);
        dispatch({
          type: AUTH_ACTIONS.LOGIN,
          payload: {
            user: u,
            token: session?.access_token ?? null,
            refreshToken: session?.refresh_token ?? null,
          },
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    });

    return () => {
      mounted = false;
      try {
        sub?.subscription?.unsubscribe();
      } catch {}
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import React from "react";
import type { IUser } from "@shared/models";
import { AUTH_ACTIONS } from "./enums";

export type AuthState = {
  isLoading: boolean;
  token: string | null;
  user: IUser | null;
  refreshToken: string | null;
};

export type AuthAction =
  | { type: AUTH_ACTIONS.LOGIN; payload: { user: IUser; token: string | null; refreshToken: string | null } }
  | { type: AUTH_ACTIONS.LOGOUT }
  | { type: AUTH_ACTIONS.SET_USER; payload: { user: IUser | null } }
  | { type: AUTH_ACTIONS.SET_TOKEN; payload: { token: string | null; refreshToken: string | null } }
  | { type: AUTH_ACTIONS.SET_LOADING; payload: { isLoading: boolean } }
  | { type: AUTH_ACTIONS.SET_ASSETS_LOADING; payload: { isLoading: boolean } };

export const initialState: AuthState = {
  isLoading: false,
  token: null,
  user: null,
  refreshToken: null,
};

export const AuthContext = React.createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}

// src/context/AuthContext.js — app-wide auth state (token + current user +
// role-aware admin impersonation).
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthAPI, AdminAPI, saveToken, clearToken, getToken,
  saveAdminOriginalToken, getAdminOriginalToken, clearAdminOriginalToken,
} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        try {
          const me = await AuthAPI.me();
          setUser(me);
          setIsImpersonating(Boolean(me.impersonated));
        } catch (e) {
          await clearToken();
        }
      }
      setBooting(false);
    })();
  }, []);

  const login = async (email, password) => {
    const { token, user } = await AuthAPI.login(email, password);
    await saveToken(token);
    setUser(user);
  };

  const signup = async (name, email, password) => {
    const { token, user } = await AuthAPI.signup(name, email, password);
    await saveToken(token);
    setUser(user);
  };

  const logout = async () => {
    await clearToken();
    await clearAdminOriginalToken();
    setIsImpersonating(false);
    setUser(null);
  };

  const refreshUser = async () => {
    const me = await AuthAPI.me();
    setUser(me);
  };

  // Admin enters another user's account. Stashes the admin's own token so
  // "خروج و بازگشت به ادمین" can restore it without a fresh login.
  const enterAsUser = async (targetUserId, accessCode) => {
    const currentToken = await getToken();
    const { token, user: targetUser } = await AdminAPI.impersonate(targetUserId, accessCode);
    await saveAdminOriginalToken(currentToken);
    await saveToken(token);
    setUser({ ...targetUser, impersonated: true });
    setIsImpersonating(true);
  };

  const exitImpersonation = async () => {
    const adminToken = await getAdminOriginalToken();
    if (!adminToken) return logout();
    await saveToken(adminToken);
    await clearAdminOriginalToken();
    setIsImpersonating(false);
    const me = await AuthAPI.me();
    setUser(me);
  };

  const value = useMemo(
    () => ({ user, booting, isImpersonating, login, signup, logout, refreshUser, enterAsUser, exitImpersonation, setUser }),
    [user, booting, isImpersonating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(sessionUser) {
    if (!sessionUser) { setUser(null); setProfile(null); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).single();
    setUser(sessionUser);
    setProfile(data || null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user || null).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function register(fullName, email, password) {
    return supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  }

  async function login(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function sendPasswordReset(email) {
    const redirectTo = `${window.location.origin}/reset-password`;
    return supabase.auth.resetPasswordForEmail(email, { redirectTo });
  }

  async function updatePassword(newPassword) {
    return supabase.auth.updateUser({ password: newPassword });
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, register, login, logout, sendPasswordReset, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import { useState, useEffect, createContext, useContext } from "react";
import { api, authStore } from "@/lib/api";

interface AuthUser {
  id: string;
  email: string;
  role: "candidate" | "admin";
  profileId: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveSession = async () => {
    const token = authStore.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get("/api/auth/me");
      setUser(data.user);
    } catch {
      authStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void resolveSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const data = await api.post("/api/auth/signup", { email, password });
      authStore.setToken(data.token);
      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post("/api/auth/signin", { email, password });
      authStore.setToken(data.token);
      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    authStore.clear();
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

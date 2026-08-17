import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth.services";
import {
  setAccessToken as saveAccessToken,
  clearAccessToken,
} from "../api/tokenManager";
import { setLogoutHandler } from "../api/authEvents";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateAccessToken = (token) => {
    setAccessToken(token);
    saveAccessToken(token);
  };

  // Restore session when the application starts
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Get a new access token using the
        // HttpOnly refresh-token cookie.
        const refreshResponse = await authService.refresh();

        const newAccessToken = refreshResponse.data.accessToken;

        updateAccessToken(newAccessToken);

        // Use the new access token to get the current user.
        const userResponse = await authService.getMe();

        setUser(userResponse.data);
      } catch (error) {
        setUser(null);
        setAccessToken(null);
        clearAccessToken();
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Register the logout handler for Axios
  useEffect(() => {
    setLogoutHandler(() => {
      setUser(null);
      setAccessToken(null);
      clearAccessToken();
    });
  }, []);

  // Normal user logout
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setAccessToken(null);
      clearAccessToken();
    }
  };

  // Provide authentication state to React
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setUser,
        setAccessToken: updateAccessToken,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

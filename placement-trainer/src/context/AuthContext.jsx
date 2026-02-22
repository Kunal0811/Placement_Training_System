import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // FIXED: Synchronously initialize state from sessionStorage. 
  // This ensures 'user' is populated on the very first render before ProtectedRoute checks it,
  // but it will be forgotten as soon as the browser tab is closed.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from sessionStorage", error);
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("user_id"); // optional
  };

  const updateUser = (updatedData) => {
    setUser(currentUser => {
      const updatedUser = { ...currentUser, ...updatedData };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
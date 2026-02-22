import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) { return null; }
  });

  // GLOBAL GAMIFICATION STATE
  const [stats, setStats] = useState({ 
      xp: 0, level: 1, next_level_xp: 100, streak: 0, interviews_taken: 0, gds_taken: 0 
  });

  const fetchStats = async () => {
    if (user?.id) {
        try {
            const res = await axios.get(`${API_BASE}/api/user/${user.id}/gamification`);
            setStats(res.data);
        } catch (err) { console.error("Failed to fetch gamification stats", err); }
    }
  };

  // Fetch stats whenever the user logs in
  useEffect(() => { fetchStats(); }, [user]);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setStats({ xp: 0, level: 1, next_level_xp: 100, streak: 0, interviews_taken: 0, gds_taken: 0 });
    sessionStorage.removeItem("user");
  };

  const updateUser = (updatedData) => {
    setUser(currentUser => {
      const updatedUser = { ...currentUser, ...updatedData };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, stats, fetchStats }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
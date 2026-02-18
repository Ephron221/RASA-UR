
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { API } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const savedUser = localStorage.getItem('rasa_user');
    if (savedUser) {
      try {
        const localData = JSON.parse(savedUser);
        // Sync with server to get latest role/permissions
        const allMembers = await API.members.getAll();
        const serverData = allMembers.find((m: any) => m.email === localData.email || m.id === localData.id);
        
        if (serverData) {
          setUser(serverData);
          localStorage.setItem('rasa_user', JSON.stringify(serverData));
        } else {
          setUser(localData);
        }
      } catch (e) {
        console.error("User sync failed", e);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('rasa_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rasa_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('rasa_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

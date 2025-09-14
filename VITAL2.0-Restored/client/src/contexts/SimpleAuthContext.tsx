import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  specialty: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test users for demonstration
const TEST_USERS: { [key: string]: User & { password: string } } = {
  'dr.johnson@hospital.com': {
    id: '1',
    email: 'dr.johnson@hospital.com',
    firstName: 'Dr. Maria',
    lastName: 'Johnson',
    role: 'doctor',
    specialty: 'Cardiología',
    password: 'Password123!'
  },
  'admin@medicalsystem.com': {
    id: '2',
    email: 'admin@medicalsystem.com',
    firstName: 'Admin',
    lastName: 'System',
    role: 'super_admin',
    specialty: 'Administración',
    password: 'Admin123!'
  }
};

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('vital_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('vital_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const testUser = TEST_USERS[email];
    if (testUser && testUser.password === password) {
      const { password: _, ...userWithoutPassword } = testUser;
      setUser(userWithoutPassword);
      localStorage.setItem('vital_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vital_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
}
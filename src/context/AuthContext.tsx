import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// User interface for onboarding context
interface User {
  id: string;
  user_type: 'student' | 'teacher';
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize user from URL parameters or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    const userType = urlParams.get('user_type') as 'student' | 'teacher' | null;
    
    if (userId && userType) {
      // Store in localStorage when URL params are present
      localStorage.setItem('userId', userId);
      localStorage.setItem('userType', userType);
      console.log('🔧 AuthContext: Set user from URL params:', { userId, userType });
      
      setUser({
        id: userId,
        user_type: userType,
        name: localStorage.getItem('userName') || undefined,
        email: localStorage.getItem('userEmail') || undefined
      });
    } else {
      // Try to get from localStorage
      const storedUserId = localStorage.getItem('userId');
      const storedUserType = localStorage.getItem('userType') as 'student' | 'teacher' | null;
      
      if (storedUserId && storedUserType) {
        console.log('🔧 AuthContext: Set user from localStorage:', { storedUserId, storedUserType });
        setUser({
          id: storedUserId,
          user_type: storedUserType,
          name: localStorage.getItem('userName') || undefined,
          email: localStorage.getItem('userEmail') || undefined
        });
      } else {
        console.log('🔧 AuthContext: No user data found in URL params or localStorage');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { User, Account } from '@/lib/types';

const UserContext = createContext<{
  user: User | null;
  accounts: Account[];
  setUser: (user: User | null) => void;
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  logout: () => void;
}>({ 
  user: null, 
  accounts: [],
  setUser: () => {},
  setAccounts: () => {},
  addAccount: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch accounts from API
  async function fetchUserAccounts(userId: string) {
    try {
      const response = await fetch(`/api/accounts?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch accounts');
      
      const fetchedAccounts = await response.json();
      console.log('Fetched accounts:', fetchedAccounts);
      
      // Update both state and localStorage
      setAccounts(fetchedAccounts);
      localStorage.setItem('accounts', JSON.stringify(fetchedAccounts));
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  }

  // Load user and accounts from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Fetch fresh data from API
      fetchUserAccounts(parsedUser.id);
    }
    
    setIsLoading(false);
  }, []); // Only run once on mount

  // Save user to localStorage whenever it changes
  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      // Fetch accounts when user logs in
      fetchUserAccounts(newUser.id);
    } else {
      localStorage.removeItem('user');
    }
  };

  // Add a single account
  const addAccount = (newAccount: Account) => {
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  // Replace all accounts
  const updateAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    localStorage.setItem('accounts', JSON.stringify(newAccounts));
  };

  const logout = () => {
    setUser(null);
    setAccounts([]);
    localStorage.removeItem('user');
    localStorage.removeItem('accounts');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      accounts, 
      setUser: updateUser, 
      addAccount, 
      setAccounts: updateAccounts, 
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

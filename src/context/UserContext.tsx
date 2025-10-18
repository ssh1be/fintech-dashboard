'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { User, Account } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';

const UserContext = createContext<{
  user: User | null;
  accounts: Account[];
  setUser: (user: User | null) => void;
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  fetchUserAccounts: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
}>({ 
  user: null, 
  accounts: [],
  setUser: () => {},
  setAccounts: () => {},
  addAccount: () => {},
  fetchUserAccounts: () => {},
  logout: () => {},
  isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  const logout = () => {
    setUser(null);
    setAccounts([]);
    localStorage.removeItem('user');
    localStorage.removeItem('accounts');
  };

  if (isLoading) {
    return (
    <div className="flex justify-center items-center h-screen text-2xl font-mono">
      <Spinner className="size-4 animate-spin mr-2" />
      Loading...
    </div>);
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      accounts, 
      setUser: updateUser, 
      addAccount, 
      setAccounts: updateAccounts, 
      logout,
      fetchUserAccounts,
      isLoading,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


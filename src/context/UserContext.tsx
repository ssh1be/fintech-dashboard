'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { User, Account, Transaction } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';

const UserContext = createContext<{
  user: User | null;
  accounts: Account[];
  transactions: Transaction[];
  setUser: (user: User | null) => void;
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  fetchUserAccounts: (userId: string) => void;
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
  addTransaction: (transaction: Transaction) => void;
  fetchUserTransactions: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
}>({ 
  user: null, 
  accounts: [],
  transactions: [],
  setUser: () => {},
  setAccounts: () => {},
  addAccount: () => {},
  fetchUserAccounts: () => {},
  selectedAccount: null,
  setSelectedAccount: () => {},
  addTransaction: () => {},
  fetchUserTransactions: () => {},
  logout: () => {},
  isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Load user and accounts from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Fetch fresh data from API
      fetchUserAccounts(parsedUser.id);
      fetchUserTransactions(parsedUser.id);
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


  // Fetch transactions from API
  async function fetchUserTransactions(userId: string) {
    try {
      const response = await fetch(`/api/transactions?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');

      const fetchedTransactions = await response.json();
      console.log('Fetched transactions:', fetchedTransactions);

      // Update both state and localStorage
      setTransactions(fetchedTransactions);
      localStorage.setItem('transactions', JSON.stringify(fetchedTransactions));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  }
  // Add a single transaction
  const addTransaction = (newTransaction: Transaction) => {
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const logout = () => {
    setUser(null);
    setAccounts([]);
    setTransactions([]);
    setSelectedAccount(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accounts');
    localStorage.removeItem('transactions');
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
      transactions,
      setUser: updateUser, 
      setAccounts, 
      addAccount, 
      fetchUserAccounts,
      selectedAccount,
      setSelectedAccount,
      addTransaction, 
      fetchUserTransactions,
      logout,
      isLoading,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


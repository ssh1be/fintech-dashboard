export type Currency = "USD" | "EUR" | "GBP" | "JPY";
// User type
export interface User {
  id: string;
  name: string;
  pin: string;
  currency: Currency;
}

// Account types
export interface BaseAccount {
  id: string;
  userId: string;
  name: string;
  balance: number;
}

export interface CheckingAccount extends BaseAccount {
  type: "checking";
  routingNumber?: number;
  overdraftLimit?: number;
}

export interface SavingsAccount extends BaseAccount {
  type: "savings";
  interestRate?: number;
  minimumBalance?: number;
}

export interface CreditCardAccount extends BaseAccount {
  type: "credit card";
  creditLimit: number;
  apr?: number;
  dueDate?: string;
}

export interface InvestmentAccount extends BaseAccount {
  type: "investment";
  // todo: add holdings array
}

export type Account = CheckingAccount | SavingsAccount | CreditCardAccount | InvestmentAccount;

// Transaction type
export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "purchase" | "payment" | "buy" | "sell" | "dividend";
  date: string;
  category?: string;
  customFields?: Record<string, string | number | boolean>;
  createdAt?: string;
}

export type Currency = "USD" | "EUR" | "GBP" | "JPY";

export interface User {
  id: string;
  name: string;
  pin: string;
  currency: Currency;
}

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
  type: "credit";
  creditLimit: number;
  apr?: number;
  dueDate?: string;
}

export interface InvestmentAccount extends BaseAccount {
  type: "investment";
  // We'll add holdings array later when we build that interface
}

export type Account = CheckingAccount | SavingsAccount | CreditCardAccount | InvestmentAccount;

interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  date: Date;
  accountType: "checking" | "savings" | "credit card" | "investment";
}

interface CheckingTransaction extends Transaction {
  accountType: "checking";
  transactionType: "deposit" | "withdrawal";
}

interface SavingsTransaction extends Transaction {
  accountType: "savings";
  transactionType: "deposit" | "withdrawal";
}

interface CreditCardTransaction extends Transaction {
  accountType: "credit card";
  transactionType: "purchase" | "payment";
}

interface InvestmentTransaction extends Transaction {
  accountType: "investment";
  transactionType: "buy" | "sell";
  investmentType: "stock" | "crypto";
}

interface StockTransaction extends InvestmentTransaction {
  investmentType: "stock";
  ticker: string;
}

interface CryptoTransaction extends InvestmentTransaction {
  investmentType: "crypto";
  crypto: string;
}


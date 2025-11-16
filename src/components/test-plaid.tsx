import { useState } from "react";
import { Button } from "./ui/button";
import { useUser } from "@/context/UserContext";
import { Transaction as PlaidTransaction } from "plaid";
import { Account, Transaction } from "@/lib/types";
import { Spinner } from "./ui/spinner";

async function convertPlaidTransactions(plaidTransactions: PlaidTransaction[], selectedAccount: Account) {
    return plaidTransactions.map((transaction) => {
        const type = transaction.amount >= 0 ? "withdrawal" : "deposit";
        const amount = Math.abs(transaction.amount);
        return {
            id: crypto.randomUUID(),
            accountId: selectedAccount!.id,
            amount: amount,
            date: transaction.date,
            type: type,
            category: (transaction.personal_finance_category?.primary)?.toLowerCase().replaceAll("_", " "),
        } as Transaction;
    });
}

export function TestPlaid({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const { selectedAccount, setTestTransactions } = useUser();

    async function getPlaidTransactions() { 
        try {
        const transactionsResponse = await fetch('/api/link/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
            const transactions = await transactionsResponse.json();
            console.log('Plaid transactions:', transactions);
            const convertedTransactions = await convertPlaidTransactions(transactions, selectedAccount!);
            setTestTransactions(convertedTransactions);
            console.log('Test transactions:', convertedTransactions);
            onSuccess();
        } catch (error) {
            console.error('Error getting public token:', error);
        }
    }
    

    return (
        <div>
            <Button disabled={loading} onClick={async () => {
                setLoading(true);
                await getPlaidTransactions();
                setLoading(false);
            }}>
                {loading ? <Spinner /> : 'Link account'}
            </Button>
        </div>
    )
}
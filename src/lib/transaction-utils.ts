import { NormalizedTransaction } from "@/components/transaction-columns";
import { Transaction } from "./types";


/**
 * Normalize transactions by flattening custom fields into a single object.
 * @param transactions - Array of transactions.
 * @returns Array of normalized transactions.
 **/
export function normalizeTransactions(transactions: (Transaction | null | undefined)[]): NormalizedTransaction[] {
  if (!transactions?.length) return [];

  // Collect all unique custom field names safely
  const allFieldNames = Array.from(
    new Set(
      transactions.flatMap((tx) =>
        tx?.customFields?.map((f: { name: string; value: string | number | boolean }) => f.name) ?? []
      )
    )
  );

  // Normalize each transaction
  return transactions
    .filter((tx): tx is Transaction => !!tx) // remove null/undefined
    .map((tx) => {
      const { customFields, ...rest } = tx;

      const fieldMap = Object.fromEntries(
        (customFields ?? []).map((f: { name: string; value: string | number | boolean }) => [`custom_${f.name}`, f.value])
      );

      // Ensure all prefixed custom fields exist
      const normalizedFields = Object.fromEntries(
        allFieldNames.map((name) => [
          `custom_${name}`,
          fieldMap[`custom_${name}`],
        ])
      );

      return { ...rest, ...normalizedFields };
    });
}

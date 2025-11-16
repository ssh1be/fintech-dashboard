import { NextRequest, NextResponse } from "next/server"
import { Configuration, PlaidApi, PlaidEnvironments, Products, TransactionsSyncRequest, Transaction as PlaidTransaction } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function POST(request: NextRequest) {
  try {
    const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
      institution_id: "ins_109508",
      initial_products: [Products.Auth, Products.Transactions],
      options: {
        override_username: "user_transactions_dynamic",
        override_password: "12345678",
        webhook: "https://webhook.site/83c160da-9cdb-4322-8a87-95055077125f", // Get a free URL from webhook.site
      }
    });
    const publicToken = publicTokenResponse.data.public_token;
    const getAccessToken = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      }
    );
    const accessToken = getAccessToken.data.access_token;
    console.log('Access token:', accessToken);
    
    // Use transactionsRefresh instead of sandboxItemFireWebhook
    try {
      await plaidClient.transactionsRefresh({
        access_token: accessToken,
      });
      console.log('Transactions refresh triggered');
      
      // Small delay to let sandbox process
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (refreshError) {
      console.log('Refresh error:', refreshError);
    }
    
    let hasMore = true;
    let cursor: string | undefined = undefined;
    let transactions: PlaidTransaction[] = [];
    while (hasMore) {
      const request: TransactionsSyncRequest = {
        access_token: accessToken,
        cursor: cursor,
        count: 500,
      };
      const response = await plaidClient.transactionsSync(request);
      const data = response.data;
      transactions.push(...data.added);
      hasMore = data.has_more;
      cursor = data.next_cursor;
    }
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json({ error: 'Failed to create public token' }, { status: 500 });
  }
}
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface InitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface VerifyResponse {
  reference: string;
  amount: number;
  status: string;
  customer: {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
  paid_at: string;
  metadata: Record<string, unknown>;
}

interface TransactionData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string | null;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string | null;
  metadata: Record<string, unknown> | string | null;
  customer: Record<string, unknown>;
  [key: string]: unknown;
}

interface CustomerData {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  customer_code: string;
  phone: string | null;
  metadata: Record<string, unknown> | null;
  risk_action: string;
  [key: string]: unknown;
}

// Paystack configuration
export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: PAYSTACK_SECRET_KEY,
};

async function paystackFetch<T>(endpoint: string, options: RequestInit = {}): Promise<PaystackResponse<T>> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not defined');
  }

  const response = await fetch(`https://api.paystack.co${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await response.json();

  if (!response.ok || !body.status) {
    throw new Error(body.message || `Paystack API error: ${response.statusText}`);
  }

  return body;
}

// Initialize transaction
export async function initializeTransaction(
  email: string,
  amount: number,
  reference?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const result = await paystackFetch<InitializeResponse>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to kobo and ensure it's an integer
        reference: reference || `ref_${Date.now()}`,
        metadata: metadata || {},
        callback_url: process.env.PAYSTACK_CALLBACK_URL || '',
      }),
    });

    if (!result.data) {
      console.error('Paystack API response missing data:', result);
      throw new Error(result.message || 'Paystack API returned no data');
    }

    return {
      success: true,
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
      reference: result.data.reference,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to initialize transaction';
    console.error('Paystack initialization error:', error);
    return {
      success: false,
      error: message,
    };
  }
}

export interface VerifyTransactionResponse {
  success: boolean;
  data?: {
    reference: string;
    amount: number;
    status: string;
    customer: {
      id: number;
      email: string;
      first_name: string | null;
      last_name: string | null;
    };
    paidAt: string | null;
    metadata: Record<string, unknown>;
  } | Record<string, unknown>;
  error?: string;
}

// Verify transaction
export async function verifyTransaction(reference: string): Promise<VerifyTransactionResponse> {
  try {
    const result = await paystackFetch<VerifyResponse>(`/transaction/verify/${reference}`);
    const data = result.data;
    
    return {
      success: true,
      data: {
        reference: data.reference,
        amount: data.amount / 100, // Convert from kobo to naira
        status: data.status,
        customer: data.customer,
        paidAt: data.paid_at,
        metadata: data.metadata,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to verify transaction';
    console.error('Paystack verification error:', error);
    return {
      success: false,
      error: message,
    };
  }
}

// List transactions
export async function listTransactions(page = 1, perPage = 50) {
  try {
    const result = await paystackFetch<TransactionData[]>(`/transaction?page=${page}&perPage=${perPage}`);

    return {
      success: true,
      data: result.data,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to list transactions';
    console.error('Paystack list transactions error:', error);
    return {
      success: false,
      error: message,
    };
  }
}

// Create customer
export async function createCustomer(email: string, firstName?: string, lastName?: string, phone?: string) {
  try {
    const result = await paystackFetch<CustomerData>('/customer', {
      method: 'POST',
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
      }),
    });

    return {
      success: true,
      data: result.data,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create customer';
    console.error('Paystack create customer error:', error);
    return {
      success: false,
      error: message,
    };
  }
}

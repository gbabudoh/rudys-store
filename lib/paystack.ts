import Paystack from 'paystack';

// Define Paystack interfaces
interface PaystackInstance {
  transaction: {
    initialize: (params: {
      email: string;
      amount: number;
      reference?: string;
      metadata?: Record<string, unknown>;
      callback_url?: string;
    }) => Promise<{ data: Record<string, unknown> }>;
    verify: (reference: string) => Promise<{ data: Record<string, unknown> }>;
    list: (params: { page: number; perPage: number }) => Promise<{ data: Record<string, unknown> }>;
  };
  customer: {
    create: (params: {
      email: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
    }) => Promise<{ data: Record<string, unknown> }>;
  };
}

// Initialize Paystack with secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY || '') as unknown as PaystackInstance;

// Paystack configuration
export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
};

// Initialize transaction
export async function initializeTransaction(
  email: string,
  amount: number,
  reference?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Convert to kobo (Paystack uses kobo)
      reference: reference || `ref_${Date.now()}`,
      metadata: metadata || {},
      callback_url: process.env.PAYSTACK_CALLBACK_URL || '',
    });

    const data = response.data as Record<string, unknown>;

    return {
      success: true,
      authorization_url: data.authorization_url as string,
      access_code: data.access_code as string,
      reference: data.reference as string,
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
    const response = await paystack.transaction.verify(reference);
    const data = response.data as Record<string, unknown>;
    
    if (data.status === 'success') {
      return {
        success: true,
        data: {
          reference: data.reference as string,
          amount: (data.amount as number) / 100, // Convert from kobo to naira
          status: data.status as string,
          customer: data.customer as {
            id: number;
            email: string;
            first_name: string | null;
            last_name: string | null;
          },
          paidAt: data.paid_at as string,
          metadata: data.metadata as Record<string, unknown>,
        },
      };
    }

    return {
      success: false,
      error: 'Transaction not successful',
      data: data as Record<string, unknown>,
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
    const response = await paystack.transaction.list({
      page,
      perPage,
    });

    return {
      success: true,
      data: response.data,
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
    const response = await paystack.customer.create({
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
    });

    return {
      success: true,
      data: response.data,
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

export default paystack;


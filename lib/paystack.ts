import Paystack from 'paystack';

// Initialize Paystack with secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY || '');

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
  metadata?: Record<string, any>
) {
  try {
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Convert to kobo (Paystack uses kobo)
      reference: reference || `ref_${Date.now()}`,
      metadata: metadata || {},
      callback_url: process.env.PAYSTACK_CALLBACK_URL || '',
    });

    return {
      success: true,
      authorization_url: response.data.authorization_url,
      access_code: response.data.access_code,
      reference: response.data.reference,
    };
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    return {
      success: false,
      error: error.message || 'Failed to initialize transaction',
    };
  }
}

// Verify transaction
export async function verifyTransaction(reference: string) {
  try {
    const response = await paystack.transaction.verify(reference);
    
    if (response.data.status === 'success') {
      return {
        success: true,
        data: {
          reference: response.data.reference,
          amount: response.data.amount / 100, // Convert from kobo to naira
          status: response.data.status,
          customer: response.data.customer,
          paidAt: response.data.paid_at,
        },
      };
    }

    return {
      success: false,
      error: 'Transaction not successful',
      data: response.data,
    };
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify transaction',
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
  } catch (error: any) {
    console.error('Paystack list transactions error:', error);
    return {
      success: false,
      error: error.message || 'Failed to list transactions',
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
  } catch (error: any) {
    console.error('Paystack create customer error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create customer',
    };
  }
}

export default paystack;


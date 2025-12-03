declare module 'paystack' {
  interface PaystackResponse<T = any> {
    status: boolean;
    message: string;
    data: T;
  }

  interface InitializeTransactionData {
    authorization_url: string;
    access_code: string;
    reference: string;
  }

  interface VerifyTransactionData {
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
    metadata: Record<string, any>;
    log: any;
    fees: number | null;
    fees_split: any;
    authorization: any;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, any> | null;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string | null;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  }

  interface TransactionListData {
    transactions: VerifyTransactionData[];
    meta: {
      total: number;
      skipped: number;
      perPage: number;
      page: number;
      pageCount: number;
    };
  }

  interface CustomerData {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    metadata: Record<string, any> | null;
    risk_action: string;
    international_format_phone: string | null;
    createdAt: string;
    updatedAt: string;
  }

  interface InitializeTransactionParams {
    email: string;
    amount: number;
    reference?: string;
    metadata?: Record<string, any>;
    callback_url?: string;
    currency?: string;
    plan?: string;
    invoice_limit?: number;
    channels?: string[];
    split_code?: string;
    subaccount?: string;
    transaction_charge?: number;
    bearer?: string;
  }

  interface CreateCustomerParams {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: Record<string, any>;
  }

  interface ListTransactionsParams {
    page?: number;
    perPage?: number;
    customer?: number;
    status?: string;
    from?: string;
    to?: string;
    amount?: number;
  }

  interface PaystackInstance {
    transaction: {
      initialize(
        params: InitializeTransactionParams
      ): Promise<PaystackResponse<InitializeTransactionData>>;
      verify(reference: string): Promise<PaystackResponse<VerifyTransactionData>>;
      list(params?: ListTransactionsParams): Promise<PaystackResponse<TransactionListData>>;
      get(id: string): Promise<PaystackResponse<VerifyTransactionData>>;
      charge(params: any): Promise<PaystackResponse<any>>;
      totals(params?: any): Promise<PaystackResponse<any>>;
      export(params?: any): Promise<PaystackResponse<any>>;
      timeline(idOrReference: string): Promise<PaystackResponse<any>>;
    };
    customer: {
      create(params: CreateCustomerParams): Promise<PaystackResponse<CustomerData>>;
      get(idOrCode: string): Promise<PaystackResponse<CustomerData>>;
      list(params?: any): Promise<PaystackResponse<any>>;
      update(idOrCode: string, params: any): Promise<PaystackResponse<CustomerData>>;
      setRiskAction(customerCode: string, riskAction: string): Promise<PaystackResponse<any>>;
      deactivateAuthorization(authorizationCode: string): Promise<PaystackResponse<any>>;
    };
    plan: {
      create(params: any): Promise<PaystackResponse<any>>;
      list(params?: any): Promise<PaystackResponse<any>>;
      get(idOrCode: string): Promise<PaystackResponse<any>>;
      update(idOrCode: string, params: any): Promise<PaystackResponse<any>>;
    };
    page: {
      create(params: any): Promise<PaystackResponse<any>>;
      list(params?: any): Promise<PaystackResponse<any>>;
      get(idOrSlug: string): Promise<PaystackResponse<any>>;
      update(idOrSlug: string, params: any): Promise<PaystackResponse<any>>;
    };
    subscription: {
      create(params: any): Promise<PaystackResponse<any>>;
      list(params?: any): Promise<PaystackResponse<any>>;
      get(idOrCode: string): Promise<PaystackResponse<any>>;
      disable(params: any): Promise<PaystackResponse<any>>;
      enable(params: any): Promise<PaystackResponse<any>>;
    };
    subaccount: {
      create(params: any): Promise<PaystackResponse<any>>;
      list(params?: any): Promise<PaystackResponse<any>>;
      get(idOrCode: string): Promise<PaystackResponse<any>>;
      update(idOrCode: string, params: any): Promise<PaystackResponse<any>>;
    };
    settlements: {
      list(params?: any): Promise<PaystackResponse<any>>;
      transactions(id: string, params?: any): Promise<PaystackResponse<any>>;
    };
    misc: {
      listBanks(params?: any): Promise<PaystackResponse<any>>;
      resolveAccount(params: any): Promise<PaystackResponse<any>>;
      resolveCardBin(bin: string): Promise<PaystackResponse<any>>;
    };
  }

  function Paystack(key: string): PaystackInstance;
  
  export = Paystack;
}


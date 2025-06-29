import { apiClient, ApiUtils } from "./client"

// Types for API responses
export interface User {
  id: string
  address: string
  username?: string
  email?: string
  createdAt: string
  updatedAt: string
}

export interface MultisigAccount {
  id: string
  address: string
  name: string
  members: string[]
  threshold: number
  balance: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  accountId: string
  to: string
  value: string
  data: string
  nonce: number
  signatures: string[]
  status: "pending" | "executed" | "failed"
  createdAt: string
  executedAt?: string
}

/**
 * Spherre API functions
 */
export const SpherreApi = {
  // User management
  async getUser(address: string): Promise<User> {
    return ApiUtils.handleResponse(() => apiClient.get(`/users/${address}`), "Failed to fetch user")
  },

  async createUser(userData: Partial<User>): Promise<User> {
    return ApiUtils.handleResponse(() => apiClient.post("/users", userData), "Failed to create user")
  },

  async updateUser(address: string, userData: Partial<User>): Promise<User> {
    return ApiUtils.handleResponse(() => apiClient.put(`/users/${address}`, userData), "Failed to update user")
  },

  // Multisig account management
  async getAccounts(userAddress: string): Promise<MultisigAccount[]> {
    return ApiUtils.handleResponse(() => apiClient.get(`/accounts?user=${userAddress}`), "Failed to fetch accounts")
  },

  async getAccount(accountId: string): Promise<MultisigAccount> {
    return ApiUtils.handleResponse(() => apiClient.get(`/accounts/${accountId}`), "Failed to fetch account")
  },

  async createAccount(accountData: {
    name: string
    members: string[]
    threshold: number
    contractAddress: string
  }): Promise<MultisigAccount> {
    return ApiUtils.handleResponse(() => apiClient.post("/accounts", accountData), "Failed to create account")
  },

  async updateAccount(accountId: string, accountData: Partial<MultisigAccount>): Promise<MultisigAccount> {
    return ApiUtils.handleResponse(
      () => apiClient.put(`/accounts/${accountId}`, accountData),
      "Failed to update account",
    )
  },

  // Transaction management
  async getTransactions(accountId: string): Promise<Transaction[]> {
    return ApiUtils.handleResponse(
      () => apiClient.get(`/accounts/${accountId}/transactions`),
      "Failed to fetch transactions",
    )
  },

  async getTransaction(transactionId: string): Promise<Transaction> {
    return ApiUtils.handleResponse(() => apiClient.get(`/transactions/${transactionId}`), "Failed to fetch transaction")
  },

  async createTransaction(transactionData: {
    accountId: string
    to: string
    value: string
    data?: string
  }): Promise<Transaction> {
    return ApiUtils.handleResponse(
      () => apiClient.post("/transactions", transactionData),
      "Failed to create transaction",
    )
  },

  async signTransaction(transactionId: string, signature: string): Promise<Transaction> {
    return ApiUtils.handleResponse(
      () => apiClient.post(`/transactions/${transactionId}/sign`, { signature }),
      "Failed to sign transaction",
    )
  },

  async executeTransaction(transactionId: string): Promise<Transaction> {
    return ApiUtils.handleResponse(
      () => apiClient.post(`/transactions/${transactionId}/execute`),
      "Failed to execute transaction",
    )
  },

  // Analytics and stats
  async getAccountStats(accountId: string): Promise<{
    totalTransactions: number
    pendingTransactions: number
    totalValue: string
    memberCount: number
  }> {
    return ApiUtils.handleResponse(() => apiClient.get(`/accounts/${accountId}/stats`), "Failed to fetch account stats")
  },
}

import { apiClient, ApiUtils } from './client'

export interface AccountSummary {
  id: string
  address: string
  name?: string
  description?: string
  is_private?: boolean
  threshold?: number
}

export interface AuthSessionResponse {
  member: string
  has_account: boolean
  accounts: AccountSummary[]
  token?: string
  refresh_token?: string
}

export interface TypedDataPayload {
  domain: Record<string, unknown>
  types: Record<string, Array<{ name: string; type: string }>>
  primaryType: string
  message: Record<string, unknown>
}

export interface SignInPayload {
  signatures: Array<string | number>
  public_key: string
  wallet_address: string
}

export const authApi = {
  async getLoginTypedData(): Promise<TypedDataPayload> {
    return ApiUtils.handleResponse(
      () => apiClient.get<TypedDataPayload>('/api/v1/auth/typed-data'),
      'Failed to fetch authentication payload',
      { suppressErrorLog: true },
    )
  },

  async signIn(payload: SignInPayload): Promise<AuthSessionResponse> {
    const formattedPayload: SignInPayload = {
      ...payload,
      signatures: payload.signatures.map((value) =>
        typeof value === 'string' ? value : value.toString(),
      ),
    }

    return ApiUtils.handleResponse(
      () =>
        apiClient.post<AuthSessionResponse>(
          '/api/v1/auth/signin',
          formattedPayload,
        ),
      'Failed to complete wallet authentication',
      { suppressErrorLog: true },
    )
  },

  async getSession(): Promise<AuthSessionResponse> {
    return ApiUtils.handleResponse(
      () => apiClient.get<AuthSessionResponse>('/api/v1/auth/me'),
      'Failed to fetch session',
      { suppressErrorLog: true },
    )
  },

  async signOut(): Promise<void> {
    await ApiUtils.handleResponse(
      () => apiClient.post('/api/v1/auth/signout'),
      'Failed to sign out',
      { suppressErrorLog: true },
    )
  },
}

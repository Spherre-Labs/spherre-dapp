/**
 * Backend API client utilities
 */

// Generic type for unknown data
type UnknownData =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null

interface ApiResponse<T = UnknownData> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: UnknownData
  timeout?: number
}

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000',
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  /**
   * Remove authentication token
   */
  clearAuthToken() {
    delete this.defaultHeaders['Authorization']
  }

  /**
   * Make API request with error handling
   */
  async request<T = UnknownData>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, timeout = 10000 } = options
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const responseData = (await response.json()) as {
        data?: T
        error?: string
        message?: string
      }

      if (!response.ok) {
        return {
          success: false,
          error:
            responseData.error ||
            responseData.message ||
            `HTTP ${response.status}`,
        }
      }

      return {
        success: true,
        data: responseData.data || (responseData as T),
        message: responseData.message,
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
          }
        }

        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: false,
        error: 'Unknown error occurred',
      }
    }
  }

  /**
   * GET request
   */
  async get<T = UnknownData>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  /**
   * POST request
   */
  async post<T = UnknownData>(
    endpoint: string,
    body?: UnknownData,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }

  /**
   * PUT request
   */
  async put<T = UnknownData>(
    endpoint: string,
    body?: UnknownData,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers })
  }

  /**
   * DELETE request
   */
  async delete<T = UnknownData>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }

  /**
   * PATCH request
   */
  async patch<T = UnknownData>(
    endpoint: string,
    body?: UnknownData,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Utility functions for common API operations
export const ApiUtils = {
  /**
   * Handle API response with error logging
   */
  async handleResponse<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    errorMessage = 'API request failed',
    options?: { suppressErrorLog?: boolean },
  ): Promise<T> {
    try {
      const response = await apiCall()

      if (!response.success) {
        if (!options?.suppressErrorLog) {
          console.error(`${errorMessage}:`, response.error)
        }
        throw new Error(response.error || errorMessage)
      }

      return response.data as T
    } catch (error) {
      if (!options?.suppressErrorLog) {
        console.error(`${errorMessage}:`, error)
      }
      throw error instanceof Error ? error : new Error(errorMessage)
    }
  },

  /**
   * Retry API call with exponential backoff
   */
  async retryRequest<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    maxRetries = 3,
    baseDelay = 1000,
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await apiCall()

        if (response.success) {
          return response
        }

        lastError = new Error(response.error || 'API request failed')
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Max retries exceeded',
    }
  },
}

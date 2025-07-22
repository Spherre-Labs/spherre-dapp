export async function getTokenImage(id: string): Promise<string | null> {
  const url = `https://api.coingecko.com/api/v3/coins/${id}`

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })
    
    clearTimeout(timeoutId)

    if (!res.ok) {
      console.warn(`CoinGecko API error for ${id}: ${res.status}`)
      return null
    }

    const data = await res.json()
    return data.image?.small || null
  } catch (error) {
    // Don't log every error to avoid console spam
    if (error instanceof Error && error.name !== 'AbortError') {
      console.warn(`Failed to fetch token image for ${id}:`, error.message)
    }
    return null
  }
}

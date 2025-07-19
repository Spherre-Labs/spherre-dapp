export async function getTokenImage(id: string): Promise<string | null> {
  const url = `https://api.coingecko.com/api/v3/coins/${id}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`CoinGecko error: ${res.status}`)
    }

    const data = await res.json()
    return data.image?.small || null
  } catch (error) {
    console.error(`Failed to fetch token image for ${id}:`, error)
    return null
  }
}

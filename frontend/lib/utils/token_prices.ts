const starknetPriceAPI =
  'https://api.coingecko.com/api/v3/simple/price?ids=starknet&vs_currencies=usd'
const ethPriceAPI =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'

export const getSTRKPrice = async () => {
  try {
    const response = await fetch(starknetPriceAPI)
    if (!response.ok) {
      throw new Error(`coingecko response status: ${response.status}`)
    }
    const json = await response.json()
    return json
  } catch (e) {
    console.log(e)
    return { starknet: { usd: 0 } }
  }
}

export const getETHPrice = async () => {
  try {
    const response = await fetch(ethPriceAPI)
    if (!response.ok) {
      throw new Error(`coingecko response status: ${response.status}`)
    }
    const json = await response.json()
    return json
  } catch (e) {
    console.log(e)
    return {
      ethereum: { usd: 0 },
    }
  }
}

export const getETHPriceEquivalent = async (amount: number) => {
  const priceResponse = await getETHPrice()
  const price = Number(priceResponse.ethereum.usd)
  return price * amount
}

export const getSTRKPriceEquivalent = async (amount: number) => {
  const priceResponse = await getSTRKPrice()
  const price = Number(priceResponse.starknet.usd)
  return price * amount
}

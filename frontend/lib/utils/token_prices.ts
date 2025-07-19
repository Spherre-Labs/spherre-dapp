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
    return json.starknet.usd
  } catch (e) {
    console.log(e)
    return 0
  }
}

export const getETHPrice = async () => {
  try {
    const response = await fetch(ethPriceAPI)
    if (!response.ok) {
      throw new Error(`coingecko response status: ${response.status}`)
    }
    const json = await response.json()
    return json.ethereum.usd
  } catch (e) {
    console.log(e)
    return 0
  }
}

export const getETHPriceEquivalent = async (amount: number) => {
  const priceResponse = await getETHPrice()
  const price = Number(priceResponse)
  return price * amount
}

export const getSTRKPriceEquivalent = async (amount: number) => {
  const priceResponse = await getSTRKPrice()
  const price = Number(priceResponse)
  return price * amount
}

export const tokenPriceFecther: Record<string, () => Promise<any>> = {
  STRK: getSTRKPrice,
  ETH: getETHPrice,
}

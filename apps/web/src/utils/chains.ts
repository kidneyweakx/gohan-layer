import { defineChain } from 'viem'

export const makeChain = (name: string, rpc: string, id: number) => {
  return {
    id: id,
    name: name,
    network: name,
    nativeCurrency: {
      decimals: 18,
      name: name,
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [rpc],
      },
      public: {
        http: [rpc],
      }
    },
    testnet: true,
  }
}
export const mantleSepolia = defineChain(
  makeChain(
    'mantleSepolia', 
    'https://rpc.sepolia.mantle.xyz', 
    5003)
  )
export const opAvail = defineChain(
  makeChain(
    'opAvail', 
    'https://op-avail-sepolia.alt.technology', 
    202402021700)
  )

export const cardona = defineChain(
  makeChain(
    'cardona', 
    'ttps://rpc.cardona.zkevm-rpc.com', 
    2442)
  )
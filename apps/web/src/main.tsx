import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import App from './App'
import Launch from './routes/launch'
import LendingPool from './routes/lend'
import ErrorPage from './routes/error'
import { QueryClient, QueryClientProvider } from "react-query";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { baseSepolia } from 'viem/chains'
import { mantleSepolia, opAvail, cardona } from './utils/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'
import { publicProvider } from 'wagmi/providers/public'

const projectId = 'e692bdfebfd147eb7a9d28dd4991518c'

const metadata = {
  name: 'GohanLayer',
  description: 'Web3Modal GohanLayer App',
  url: '',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const { chains, publicClient } = configureChains(
  [mantleSepolia, baseSepolia, opAvail, cardona],
  [walletConnectProvider({ projectId }), publicProvider()],
  
)
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
  ],
  publicClient
})

createWeb3Modal({ wagmiConfig, projectId, chains })
const queryClient = new QueryClient();

const rootElement = document.getElementById('root')

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'launch',
    element: <Launch />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'lend',
    element: <LendingPool />,
    errorElement: <ErrorPage />,
  }
])

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
      </WagmiConfig>
    </QueryClientProvider>
    
  )
} else {
  console.error('Root element with id "root" not found')
}

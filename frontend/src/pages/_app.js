import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import { useContext } from 'react'
import { userAddressContext } from '@/helper/userAddressContext';
import { useState } from 'react';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  midnightTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';

import { Chain } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';



const fantomChain = {
  id: 250,
  name: 'Fantom',
  network: 'opera',
  iconUrl: 'https://example.com/icon.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'FANTOM',
    symbol: 'FTM',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/fantom/'],
    },
  },
  blockExplorers: {
    default: { name: 'FantomScan', url: 'https://ftmscan.com/' },
    etherscan: { name: 'FantomScan', url: 'https://ftmscan.com/' },
  },
  testnet: false,
};

const { provider, chains } = configureChains(
  [fantomChain],
  [
    jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {

  const [userAddress, setUserAddress] = useState("");

  return(
    <userAddressContext.Provider value={{ userAddress, setUserAddress }}>
    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}  theme={lightTheme({
      accentColor: '#186ede',
      accentColorForeground: 'black',
      borderRadius: 'large',
      fontStack: 'system',
      overlayBlur: 'small',
    })}>
   <Component {...pageProps} />
   </RainbowKitProvider>
   </WagmiConfig>
   </userAddressContext.Provider>
  )

}

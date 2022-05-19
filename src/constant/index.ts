export const CHAIN_ID = 1666700000;
export const MULTICALL_ADDRESS = '0xd078799c53396616844e2fa97f0dd2b4c145a685';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const CONTRACT_NFT = '0x701d1907fd9Ed5A1B4d6f005D602C723F9fD47fa';
export const CONTRACT_xGrav = '0x098B7350b8ae4BA2F2C56E3C2993C6d6a2214FF1';
export const CONTRACT_Grav = '0x5200242744843aEd32cbc1F3c0565f2c5968B1F9';
export const CONTRACT_Voyager = '0xdB2A68E4abe45BC7B7aB8C479b021cE0882fb744';

// MAIN NET
// export const CHAIN_ID = 1666600000;
// export const MULTICALL_ADDRESS = '0x34b415f4d3b332515e66f70595ace1dcf36254c5';

export const NFT_IMAGE_URL = 'https://puffs.mypinata.cloud/ipfs/QmcfT6TK8BpuptbGaabPes8eJM37Py7Kq4Jj2E37mGH6LU/'

export const DefaultNetwork = Number(CHAIN_ID);

export const supportedChainIds = [Number(CHAIN_ID)];

export const NETWORK_ID = CHAIN_ID.toString();
export const RPC_URLS = {
  1666600000: 'https://api.harmony.one',
  1666700000: 'https://api.s0.b.hmny.io',
};

export type Network = {
  name: string;
  chainId: number;
  rpcUrl: string[];
  label: string;
  explorer: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const networkInfo: Network[] = [
  {
    name: 'Harmony Mainnet',
    label: 'Harmony Mainnet',
    chainId: 1666600000,
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
    rpcUrl: ['https://api.harmony.one'],
    explorer: ['https://explorer.harmony.one/'],
  },
  {
    name: 'Harmony Testnet',
    label: 'Harmony Testnet',
    chainId: 1666700000,
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
    rpcUrl: ['https://api.s0.b.hmny.io'],
    explorer: ['https://explorer.pops.one/'],
  },
];

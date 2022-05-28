export const CHAIN_ID = 1666700000;
export const MULTICALL_ADDRESS = '0xd078799c53396616844e2fa97f0dd2b4c145a685';


//----------------------------------MAIN NET------------------------------------------//
// export const CHAIN_ID = 1666600000;
// export const MULTICALL_ADDRESS = '0x34b415f4d3b332515e66f70595ace1dcf36254c5';
//------------------------------------------------------------------------------------//

//---------------------------------contract address-------------------------------------
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const CONTRACT_NFT_PUFF = '0x701d1907fd9Ed5A1B4d6f005D602C723F9fD47fa';
export const CONTRACT_MARKETPLACE = '0x9542a61F170478d31d37522E2082aB3d46c28775';
export const PUFF_IMAGE_URL = 'https://puffs.mypinata.cloud/ipfs/QmcfT6TK8BpuptbGaabPes8eJM37Py7Kq4Jj2E37mGH6LU/d'

//------------------------------Info for connect wallet-----------------------------------

export const DefaultNetwork = Number(CHAIN_ID);

export const supportedChainIds = [Number(CHAIN_ID)];

export const NETWORK_ID = CHAIN_ID.toString();
export const RPC_URLS = {
  1666600000: 'https://api.harmony.one',
  1666700000: 'https://api.s0.b.hmny.io',
};

export const networkInfo = [
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

export const GRAPHQL_ENDPOINT = 'http://34.234.63.140:8000/subgraphs/name/oneverse/oneverse-subgraph';
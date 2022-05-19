import { VoyageData } from '../components/voyages/asteroidMining/voyageItem';
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
  setMulticallAddress,
} from 'ethers-multicall';
import { CHAIN_ID, DefaultNetwork, networkInfo } from '../constant';
export const STAKE_DURATION = 1 * 24 * 3600;

export const shortAddress = (address: string) => {
  return `${address.slice(2, 5)}...${address.slice(-3)}`;
};

export const getRegNumber = (str: string) => {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const chainIdToHexString = (chain_id: number) => {
  return '0x' + chain_id.toString(16);
};

export const changeNetwork = async () => {
  const wa: any = window;
  const ethereum = wa.ethereum;
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdToHexString(DefaultNetwork) }],
    });
  } catch (switchError) {
    const error = JSON.parse(JSON.stringify(switchError));
    console.log(error.code);
    if (
      error.code === 4902 ||
      (error.code === -32603 && error?.data?.originalError.code === 4902)
    ) {
      try {
        const item = networkInfo.filter((x) => x.chainId === DefaultNetwork)[0];
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdToHexString(DefaultNetwork),
              chainName: item.label,
              rpcUrls: item.rpcUrl,
              nativeCurrency: item.nativeCurrency,
              blockExplorerUrls: item.explorer,
            },
          ],
        });
        console.log('done');
      } catch (addError) {
        console.log('addError', addError);
      }
    }
  }
};

export const getNftRarity = async (nftId: number) => {
  if (!process.env.REACT_APP_RARITY_URL) {
    console.log('Not env file');
    return { nftRarity: -1, signature: '' };
  }
  try {
    const url = process.env.REACT_APP_RARITY_URL + nftId;
    const res = await (await fetch(url)).json();
    return {
      nftRarity: res.voucher.rarity ?? -1,
      signature: res.signature ?? '',
    };
  } catch (err) {
    console.log(err);
    return { nftRarity: -1, signature: '' };
  }
};

export const checkStakeEnd = (voyage: VoyageData) => {
  return (
    (voyage.stakedTime + STAKE_DURATION * voyage.tokens.length) * 1000 <
    Date.now()
  );
};

export const setupMultiCallContract = async (
  nftAddress: string,
  nftABI: any,
  provider: any
) => {
  setMulticallAddress(CHAIN_ID, '0xd078799c53396616844e2fa97f0dd2b4c145a685');
  const ethcallProvider = new MulticallProvider(provider);

  await ethcallProvider.init();

  const multicallContract = new MulticallContract(nftAddress, nftABI);
  return [ethcallProvider, multicallContract];
};

export const formatAmount = (val: number, count: number = 2) => {
  return (
    Array(Math.max(0, count - val.toString().length))
      .fill('0')
      .join('') + val
  );
};

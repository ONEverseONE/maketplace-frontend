import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { RPC_URLS, supportedChainIds } from "../constant"

export const network = new NetworkConnector({
  urls: { 97: RPC_URLS[1666600000], 56: RPC_URLS[1666700000]  },
  defaultChainId: supportedChainIds[0],
});

export const injected = new InjectedConnector({
  supportedChainIds: supportedChainIds,
});

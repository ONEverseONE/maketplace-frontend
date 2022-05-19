import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useEffect, useState } from 'react';
import { DefaultNetwork } from '../../../constant';
import { useEagerConnect } from '../../../hooks/useEagerConnect';
import { useInactiveListener } from '../../../hooks/useInactiveListener';
import { changeNetwork, shortAddress } from '../../../utils';
import { IconWallet } from '../icons';
import styles from './WalletBox.module.scss';

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [DefaultNetwork],
});

export const WalletBox: React.FC = () => {
  const { error, account, activate, active, connector } = useWeb3React();

  const [wrongNetwork, setWrongNetwork] = useState(false);
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
  useEffect(() => {
    console.log(wrongNetwork);
    if (wrongNetwork) changeNetwork();
  }, [wrongNetwork]);
  useEffect(() => {
    setWrongNetwork(isUnsupportedChainIdError);
  }, [isUnsupportedChainIdError]);

  const connectWallet = async () => {
    try {
      await activate(injectedConnector);
    } catch (err) {
      console.log(err);
    }
  };
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);
  return wrongNetwork ? (
    <div className={styles.walletBox}>
      <div className={styles.connectBtn} onClick={changeNetwork}>
        Switch Network
      </div>
    </div>
  ) : !active ? (
    <div className={styles.walletBox}>
      <div className={styles.connectBtn} onClick={connectWallet}>
        CONNECT WALLET
      </div>
    </div>
  ) : (
    <div className={styles.accountBox}>
      <div className={styles.walletBtn}>
        <IconWallet />
        {account ? shortAddress(account) : ''}
      </div>
    </div>
  );
};

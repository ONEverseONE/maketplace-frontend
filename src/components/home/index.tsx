import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleBox } from '../ui/titleBox';
import { WalletBox } from '../ui/walletBox';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  const { account } = useWeb3React();
  const [title, setTitle] = useState<string>('ROOMS');
  const [description, setDescription] = useState<string>('SPACE');
  const [subTitle, setSubTitle] = useState<string>('SPACE');
  return (
    <div className={styles.bgHome}>
      <div className={styles.base}>
        <Link
          to="/voyages"
          className={styles.quest}
          onMouseEnter={() => {
            setTitle('VOYAGES');
            setDescription('QUESTS');
          }}
          onMouseLeave={() => {
            setTitle(' ');
            setDescription(' ');
          }}
        >
          <div>
            <img src="/img/quest.png" width="272px" alt="" />
          </div>
        </Link>
        <a
          href="https://game.defikingdoms.com/#/marketplace"
          target="_blank"
          className={styles.land}
          onMouseEnter={() => {
            setTitle('ROOMS');
            setSubTitle('SPACE');
            setDescription('ONEVERSE LANDS');
          }}
          onMouseLeave={() => {
            setTitle(' ');
            setSubTitle('');
            setDescription(' ');
          }}
        >
          <div>
            <img src="/img/land.png" width="566px" alt="" />
          </div>
        </a>
        <a
          href="https://oneverse.one/staking"
          target="_blank"
          className={styles.stake}
          onMouseEnter={() => {
            setTitle('BANK');
            setDescription('STAKING');
          }}
          onMouseLeave={() => {
            setTitle(' ');
            setDescription(' ');
          }}
        >
          <div>
            <img src="/img/stake.png" width="204px" alt="" />
          </div>
        </a>
        <img src="/img/base.png" width="660px" alt="" />
      </div>
      <div className={styles.wallet}>
        <WalletBox />
        <div className={styles.buyOne}>
          <h2>Buy ONE</h2>
          <a
            href={`https://buy.ramp.network/${
              account ? '?userAddress=' + account : ''
            }`}
            target="_blank"
          >
            <img src="/img/logoRamp.svg" height="25px" alt="" />
            <span>Ramp</span>
          </a>
          <a href="https://dlocal.com/" target="_blank">
            <img src="/img/logoDlocal.png" height="24px" alt="" />
          </a>
        </div>
      </div>
      <TitleBox title={title} subTitle={subTitle} description={description} />
    </div>
  );
};

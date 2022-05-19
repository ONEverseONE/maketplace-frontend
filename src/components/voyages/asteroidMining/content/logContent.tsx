import { useEffect, useState } from 'react';
import { NFT_IMAGE_URL } from '../../../../constant';
import { formatAmount, getNftRarity } from '../../../../utils';
import { IconSwap } from '../../../ui/icons';
import { LogData } from '../logItem';
import { NftData, NftItem } from '../nftItem';
import { FeeBox } from './feeBox';
import styles from './VoyageContent.module.scss';

type PageProps = {
  log: LogData | null;
};

export const LogContent: React.FC<PageProps> = ({ log }) => {
  const [nfts, setNfts] = useState<NftData[]>([]);

  useEffect(() => {
    if (log) {
      getNfts(log.tokens);
    }
  }, [log]);

  const getNfts = async (tokenIds: number[]) => {
    try {
      const rarities = await Promise.all(
        tokenIds.map((id: number) => getNftRarity(id))
      );
      setNfts(
        rarities.map((item: any, index: number) => ({
          tokenId: Number(tokenIds[index]),
          rarity: item.nftRarity,
          signature: item.signature,
          img: `${NFT_IMAGE_URL}${Number(tokenIds[index])}.png`,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.logContent}>
      <h1>VOYAGE REPORT</h1>
      {log && (
        <div className={styles.logData}>
          <div className={styles.details}>
            <div className={styles.stakeInfo}>
              <div className={styles.infoItem}>
                <span></span>
                <p>VOYAGE</p>
                <h3>{log.id}</h3>
              </div>
              <div className={styles.infoItem}>
                <span></span>
                <p>PUFFS/VOYAGE</p>
                <h3>{formatAmount(log.amount * log.xgravPerPuff)}</h3>
              </div>
              <div className={styles.infoItem}>
                <span></span>
                <p>XGRAV/PUFF</p>
                <h3>x{formatAmount(log.xgravPerPuff)}</h3>
              </div>
              <div className={styles.infoItem}>
                <span></span>
                <p>INDIVIDUALLY?</p>
                <h3>
                  <span className={log.amount === 1 ? styles.active : ''}>
                    Y
                  </span>
                  <span>/</span>
                  <span className={log.amount !== 1 ? styles.active : ''}>
                    N
                  </span>
                </h3>
              </div>
            </div>
            <div className={styles.nfts}>
              <div>
                {nfts.map((nft: NftData, index: number) => (
                  <NftItem
                    nft={nft}
                    selected={false}
                    clickHandler={() => {}}
                    key={`report-nft=${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.results}>
            <div className={styles.resultsTitle}>
              <h6></h6>
              <h3>
                VOYAGE
                <br />
                RESULTS
              </h3>
            </div>
            <div className={styles.resultsContent}>
              <div className={styles.successful}>
                <h6></h6>
                <p>SUCCESSFUL</p>
                <p>PUFF(S)</p>
                <h2>
                  <span className={styles.blue}>
                    {log.win ? formatAmount(log.amount) : 0}
                  </span>
                  /{formatAmount(log.amount)}
                </h2>
              </div>
              <div className={styles.successful}>
                <h6></h6>
                <p>SUCCESSFUL</p>
                <p>
                  <span className={styles.yellow}>XGRAV</span>
                  <IconSwap />
                  <span className={styles.purple}>GRAV</span>
                </p>
                <h2>
                  <span className={styles.purple}>
                    {log.win ? formatAmount(log.amount * log.xgravPerPuff) : 0}
                  </span>
                  /{formatAmount(log.amount * log.xgravPerPuff)}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
      <FeeBox isLog />
    </div>
  );
};

import styles from './NftItem.module.scss';

export type NftData = {
  img: string;
  tokenId: number;
  rarity: number;
  signature: string;
};

type PageProps = {
  nft: NftData;
  selected: boolean;
  clickHandler: (tokenId: number) => void;
};

export const NftItem: React.FC<PageProps> = ({
  nft,
  selected,
  clickHandler,
}) => {
  return (
    <div
      className={`${styles.border} ${styles.nftItem} ${
        selected ? styles.active : ''
      }`}
      onClick={() => {
        clickHandler(nft.tokenId);
      }}
    >
      <div className={styles.sideBorder}></div>
      <div className={styles.imgBox}>
        <img src={nft.img} width="100%" alt="" />
        <div className={styles.nftInfo}>
          <div className={styles.rarity}>
            <p>RARITY SCORE</p>
            <h3>{nft.rarity}</h3>
          </div>
          <div className={styles.tokenInfo}>
            <p>PUFF</p>
          </div>
        </div>
        <div className={styles.tokenId}>
          <div className={styles.topBorder} />
          <div className={styles.bottomBorder} />#{nft.tokenId}
        </div>
      </div>
    </div>
  );
};

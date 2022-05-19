import { checkStakeEnd, formatAmount } from '../../../../utils';
import { IconTriangleBorder, IconTriangleFill } from '../../../ui/icons';
import { Timer } from '../../../ui/timer';
import styles from './VoyageItem.module.scss';
import { ClipLoader } from 'react-spinners';

export type VoyageData = {
  img: string;
  id: number;
  tokens: number[];
  amount: number;
  stakedTime: number;
};

type PageProps = {
  voyage: VoyageData;
  selected: boolean;
  isProgress: boolean;
  isSpinning: boolean;
  endHandler: (tokenIds: number[], isEarly: boolean) => void;
  selectHandler: () => void;
};

export const VoyageItem: React.FC<PageProps> = ({
  voyage,
  selected,
  isProgress,
  isSpinning,
  endHandler,
  selectHandler,
}) => {
  const completed = checkStakeEnd(voyage);
  return (
    <div
      className={`${styles.border} ${styles.voyageItem} ${
        !completed ? styles.unstake : ''
      } ${selected ? styles.active : ''}`}
      onClick={selectHandler}
    >
      <div className={styles.sideBorder}></div>
      <div className={styles.triangle}>
        {selected ? <IconTriangleFill /> : <IconTriangleBorder />}
      </div>
      <div className={styles.imgBox}>
        <img src={voyage.img} width="95px" alt="" />
      </div>
      <div className={styles.voyageId}>
        <span></span>
        <p>VOYAGE</p>
        <h2>{voyage.id}</h2>
      </div>
      <div className={styles.prices}>
        <div className={styles.border}>
          <p>
            <span>{formatAmount(voyage.tokens.length)}</span> PUFFS STAKED
          </p>
          <p>
            <span>0{voyage.amount}</span> XGRAV/PUFF
          </p>
        </div>
      </div>

      <div className={styles.btns}>
        <div className={styles.border}>
          <button
            className={styles.claimBtn}
            onClick={() => {
              endHandler([voyage.id], false);
            }}
            disabled={isProgress}
            style={!completed && !isProgress ? { opacity: '1' } : {}}
          >
            <p
              style={{
                background: completed
                  ? '#7DCFB6'
                  : `linear-gradient(90deg, rgba(125, 207, 182, 0.75) 0%, rgba(125, 207, 182, 0.75) ${
                      ((Date.now() - voyage.stakedTime * 1000) /
                        (voyage.tokens.length * 24 * 3600000)) *
                      100
                    }%, rgba(128, 132, 160, 0.75) ${
                      ((Date.now() - voyage.stakedTime * 1000) /
                        (voyage.tokens.length * 24 * 3600000)) *
                      100
                    }%)`,
              }}
            >
              {completed ? (
                isSpinning ? (
                  <ClipLoader
                    color="currentColor"
                    size={18}
                    loading={isSpinning}
                  />
                ) : (
                  'CLAIM'
                )
              ) : (
                <Timer
                  date={voyage.stakedTime + voyage.tokens.length * 24 * 3600}
                  small
                />
              )}
            </p>
          </button>
          <button
            className={styles.unstakeBtn}
            onClick={() => {
              endHandler([voyage.id], true);
            }}
            disabled={completed || isProgress}
          >
            <p>
              {isSpinning && !completed ? (
                <ClipLoader
                  color="currentColor"
                  loading={isSpinning}
                  size={18}
                />
              ) : (
                'UNSTAKE EARLY'
              )}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

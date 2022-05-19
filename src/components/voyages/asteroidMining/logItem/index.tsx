import { formatAmount } from '../../../../utils';
import { IconTriangleBorder, IconTriangleFill } from '../../../ui/icons';
import styles from './LogItem.module.scss';

export type LogData = {
  img: string;
  id: number;
  xgravPerPuff: number;
  amount: number;
  win: boolean;
  tokens: number[];
};

type PageProps = {
  log: LogData;
  selected: boolean;
  clickHandler: (tokenId: number) => void;
};

export const LogItem: React.FC<PageProps> = ({
  log,
  selected,
  clickHandler,
}) => {
  return (
    <div
      className={`${styles.border} ${styles.logItem} ${
        selected ? styles.active : ''
      }`}
    >
      <div className={styles.sideBorder}></div>
      <div className={styles.triangle}>
        {selected ? <IconTriangleFill /> : <IconTriangleBorder />}
      </div>
      <div className={styles.imgBox}>
        <img src={log.img} width="95px" alt="" />
      </div>
      <div className={styles.logId}>
        <span></span>
        <p>VOYAGE</p>
        <h2>{log.id}</h2>
      </div>
      <div className={styles.prices}>
        <div className={styles.border}>
          <p>
            <span>{formatAmount(log.amount)}</span> PUFFS STAKED
          </p>
          <p>
            <span>0{log.xgravPerPuff}</span> XGRAV/PUFF
          </p>
        </div>
      </div>

      <div className={styles.btns}>
        <div className={styles.border}>
          <div
            className={styles.reportBtn}
            onClick={() => {
              clickHandler(log.id);
            }}
          >
            <p>
              VOYAGE
              <br />
              REPORT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

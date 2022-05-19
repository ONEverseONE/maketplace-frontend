import { IconSwap } from '../../../../ui/icons';
import styles from './FreeBox.module.scss';

export const FeeBox: React.FC<{ isLog?: boolean; incompleted?: boolean }> = ({
  isLog,
  incompleted,
}) => {
  return (
    <div className={styles.prices}>
      <div className={styles.priceBox}>
        <p>
          <span className={styles.yellow}>XGRAV</span>
          <span className={styles.white}>FEE</span>
        </p>
        <div
          className={`${styles.price} ${
            isLog ? styles.log : incompleted ? styles.incompleted : ''
          }`}
        >
          002
        </div>
      </div>

      <div className={styles.priceBox}>
        <p>
          <span className={styles.yellow}>XGRAV</span> <IconSwap />
          <span>FEE</span>
        </p>
        <div
          className={`${styles.price} ${
            isLog ? styles.log : incompleted ? styles.incompleted : ''
          }`}
        >
          0069
        </div>
      </div>
    </div>
  );
};

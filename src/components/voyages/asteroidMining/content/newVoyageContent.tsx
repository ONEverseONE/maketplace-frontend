import { FeeBox } from './feeBox';
import styles from './VoyageContent.module.scss';

export const NewVoyageContent: React.FC = () => {
  return (
    <>
      <div className={styles.newVoyageContentBox}>
        <div>
          <p>
            <span className={styles.bgBlue}>ASTEROID MINING</span> lets your
            Puffs take their <span className={styles.yellow}>xGRAV</span> and
            try to convert it to <span className={styles.purple}>GRAV</span>.
          </p>
          <p>
            Start each Puffs’ Voyage individually and spread your luck among
            each or put them together to strategically average out your{' '}
            <span className={styles.white}>Rarity Scores</span> for the best
            chances at success!{' '}
          </p>
          <p>
            <span className={styles.white}>Rarity Scores</span> are averaged
            together when multiple Puffs go on a Voyage together and you only
            get one Voyage per Puff per day so plan accordingly.
          </p>
          <p>
            Each Voyage has an <span className={styles.yellow}>xGRAV</span> fee
            of <span className={styles.yellow}>1 xGRAV</span> or{' '}
            <span className={styles.yellow}>2 xGRAV</span>. This includes groups
            so grouping your Puffs can save big!
          </p>
        </div>
      </div>
      <FeeBox />
    </>
  );
};

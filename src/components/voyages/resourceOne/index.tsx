import { Link } from 'react-router-dom';
import { IconCloseSm } from '../../ui/icons';
import styles from './ResourceOne.module.scss';

export const ResourceOne: React.FC = () => {
  return (
    <div className={styles.resourcePage}>
      <div className={styles.url}>
        <p>\\ONEVERSE\VOYAGES_V1.0\RESOURCE-ONE.EXE</p>
        <Link to="/voyages" className={styles.close}>
          <IconCloseSm />
        </Link>
      </div>
      <div className={styles.resourceBox}>
        <div className={styles.resourceLeft}></div>
        <div className={styles.resourceRight}></div>
      </div>
    </div>
  );
};

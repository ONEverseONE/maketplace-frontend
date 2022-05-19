import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconClose } from '../../ui/icons';
import { TitleBox } from '../../ui/titleBox';
import styles from './VoyagesMenu.module.scss';

export const VoyagesMenu: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  return (
    <div className={styles.menuPage}>
      <Link to="/" className={styles.close}>
        <IconClose />
      </Link>
      <div className={styles.menu}>
        <h3>\\ONEVERSE\VOYAGES_V1.0\</h3>
        <div className={styles.menuBox}>
          <Link
            to="/voyages/resource-one"
            onMouseEnter={() => {
              setDescription(
                'Gather resources that you can use to build your own voyager ships'
              );
            }}
            onMouseLeave={() => {
              setDescription('');
            }}
          >
            RESOURCE ONE
          </Link>
          <Link
            to="/voyages/asteroid-mining"
            onMouseEnter={() => {
              setDescription(
                'Puffs have a chance to take their xGRAV and convert it to GRAV'
              );
            }}
            onMouseLeave={() => {
              setDescription('');
            }}
          >
            ASTEROID MINING
          </Link>
        </div>
        <p>{description}</p>
      </div>
      <TitleBox title="VOYAGES" subTitle="" description="QUESTS" />
    </div>
  );
};

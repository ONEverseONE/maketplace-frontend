import { IconTriangle } from '../../../ui/icons';
import styles from './CargoSize.module.scss';

type PageProps = {
  currentSize: number;
  clickHandler: (size: number) => void;
};

export const CargoSize: React.FC<PageProps> = ({
  currentSize,
  clickHandler,
}) => {
  return (
    <div className={styles.cargoSize}>
      <div className={styles.triangles}>
        <IconTriangle />
        <IconTriangle />
      </div>
      <div className={styles.cargoSizeBox}>
        <div className={styles.cargoText}>
          <h1>
            CARGO
            <br />
            SIZE
          </h1>
          <p>[xGRAV/PUFF]</p>
        </div>
        <div className={styles.imgs}>
          <div
            className={`${styles.img} ${
              currentSize === 1 ? styles.active : ''
            }`}
            onClick={() => {
              clickHandler(1);
            }}
          >
            <img src="/img/cargo-size1.svg" alt="" />
          </div>
          <div
            className={`${styles.img} ${
              currentSize === 2 ? styles.active : ''
            }`}
            onClick={() => {
              clickHandler(2);
            }}
          >
            <img src="/img/cargo-size2.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

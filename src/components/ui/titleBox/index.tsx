import styles from './TitleBox.module.scss';

type PageProps = {
  title: string;
  subTitle: string;
  description: string;
};

export const TitleBox: React.FC<PageProps> = ({
  title,
  subTitle,
  description,
}) => {
  return (
    <div className={styles.label}>
      <div className={styles.title}>
        {subTitle !== '' && <span>{subTitle}</span>}
        <h1>{title}</h1>
      </div>
      <p>{description}</p>
    </div>
  );
};

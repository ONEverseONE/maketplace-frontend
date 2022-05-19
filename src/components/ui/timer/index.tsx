import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { formatAmount } from '../../../utils';
import styles from './Timer.module.scss';

type rendererProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: any;
};

export const Timer: React.FC<{ date: number; small?: boolean }> = ({
  date,
  small,
}) => {
  const [timer, setTimer] = useState<number>(0);
  const [hrs, setHrs] = useState<number>(0);
  const [mins, setMins] = useState<number>(0);
  const [secs, setSecs] = useState<number>(0);

  let interval: any;

  useEffect(() => {
    if (date && date * 1000 > Date.now()) {
      interval = setInterval(() => {
        const remain = date - Math.floor(Date.now() / 1000);
        setHrs(Math.floor(remain / 3600));
        setMins(Math.floor((remain % 3600) / 60));
        setSecs(remain % 60);
      }, 1000);
    } else {
      setHrs(0);
      setMins(0);
      setSecs(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // setTimer(date);
  }, [date]);
  return (
    <span className={`${styles.counter} ${small ? styles.small : ''}`}>
      {formatAmount(hrs)}:{formatAmount(mins)}:{formatAmount(secs)}
    </span>
  );
};

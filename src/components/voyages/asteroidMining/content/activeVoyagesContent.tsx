import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CONTRACT_Voyager } from '../../../../constant';
import { ABI_Voyage } from '../../../../constant/abis';
import { checkStakeEnd, formatAmount, STAKE_DURATION } from '../../../../utils';
import { IconSwap, IconTriangle } from '../../../ui/icons';
import { Timer } from '../../../ui/timer';
import { VoyageData } from '../voyageItem';
import { FeeBox } from './feeBox';
import styles from './VoyageContent.module.scss';
import { ClipLoader } from 'react-spinners';

type PageProps = {
  isWin: boolean | null;
  nowVoyage: VoyageData | null;
  oldVoyage: VoyageData;
  completedVoyages: number[];
  inCompletedVoyages: number[];
  isProcess: boolean;
  idsInProcess: number[] | null;
  isContentProcess: boolean;
  endVoyages: (items: number[], completed: boolean) => void;
};
export const ActiveVoyagesContent: React.FC<PageProps> = ({
  isWin,
  nowVoyage,
  oldVoyage,
  completedVoyages,
  inCompletedVoyages,
  isProcess,
  idsInProcess,
  isContentProcess,
  endVoyages,
}) => {
  const [voyage, setVoyage] = useState<VoyageData>(oldVoyage);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (nowVoyage) {
      setCompleted(checkStakeEnd(nowVoyage));
      setVoyage(nowVoyage);
    }
  }, [nowVoyage]);
  return (
    <div className={styles.activeVoyagesContent}>
      {nowVoyage || isWin !== null ? (
        <>
          <div className={styles.contentTitle}>
            <div>
              <h6></h6>
              <p>VOYAGE</p>
            </div>
            <h3>{voyage.id}</h3>
          </div>
          <div
            className={`${styles.detailBox} ${
              !completed ? styles.incompleted : ''
            }`}
          >
            {isWin === null ? (
              <div>
                <div className={styles.endBtnBox}>
                  <button
                    className={styles.endBtn}
                    disabled={isProcess}
                    onClick={() => {
                      endVoyages([voyage.id], completed);
                    }}
                  >
                    {completed ? (
                      idsInProcess?.length === 1 &&
                      isContentProcess &&
                      idsInProcess.includes(voyage.id) ? (
                        <p>
                          <ClipLoader
                            color="currentColor"
                            size={36}
                            loading={
                              idsInProcess?.length === 1 &&
                              isContentProcess &&
                              idsInProcess.includes(voyage.id)
                            }
                          />
                        </p>
                      ) : (
                        <p>
                          END
                          <br />
                          VOYAGES
                        </p>
                      )
                    ) : idsInProcess?.length === 1 &&
                      isContentProcess &&
                      idsInProcess.includes(voyage.id) ? (
                      <p>
                        <ClipLoader
                          color="currentColor"
                          size={36}
                          loading={
                            idsInProcess?.length === 1 &&
                            isContentProcess &&
                            idsInProcess.includes(voyage.id)
                          }
                        />
                      </p>
                    ) : (
                      <p>
                        END VOYAGE
                        <br />
                        EARLY
                      </p>
                    )}
                  </button>
                  <div className={styles.endBtnDescription}>
                    <IconTriangle />
                    {completed ? (
                      <p>END THE VOYAGE AND CHECK YOUR CARGO FOR GRAV! </p>
                    ) : (
                      <p>
                        END YOUR VOYAGE EARLY AND KEEP YOUR CARGO SAFE!
                        <br />
                        <br />
                        OUR XGRAV REMAINS AS XGRAV.
                        <br />
                        <br />
                        01/02 XGRAV FEE IS BURNT.
                      </p>
                    )}
                  </div>
                </div>
                <div className={styles.detailInfo}>
                  <div className={styles.stakeInfo}>
                    <div className={styles.infoItem}>
                      <h6></h6>
                      <p>PUFFS/VOYAGE</p>
                      <h3>{formatAmount(voyage.tokens.length)}</h3>
                    </div>
                    <div className={styles.infoItem}>
                      <h6></h6>
                      <p>XGRAV/PUFF</p>
                      <h3>x{formatAmount(voyage.amount)}</h3>
                    </div>
                    <div className={styles.infoItem}>
                      <h6></h6>
                      <p>INDIVIDUALLY?</p>
                      <h3>
                        <span
                          className={
                            voyage.tokens.length === 1 ? styles.active : ''
                          }
                        >
                          Y
                        </span>
                        /
                        <span
                          className={
                            voyage.tokens.length === 1 ? '' : styles.active
                          }
                        >
                          N
                        </span>
                      </h3>
                    </div>
                  </div>
                  <div className={styles.countdown}>
                    <h6></h6>
                    <p>TIME REMAINING</p>
                    <Timer
                      date={
                        voyage.stakedTime +
                        STAKE_DURATION * voyage.tokens.length
                      }
                    />
                    <img
                      src={`/img/timebar${completed ? '' : 'red'}.svg`}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.report}>
                <h1>VOYAGE REPORT</h1>

                <div className={styles.stakeInfo}>
                  <div className={styles.infoItem}>
                    <h6></h6>
                    <p>VOYAGE</p>
                    <h3>{voyage.id}</h3>
                  </div>
                  <div className={styles.infoItem}>
                    <h6></h6>
                    <p>PUFFS/VOYAGE</p>
                    <h3>{formatAmount(voyage.tokens.length)}</h3>
                  </div>
                  <div className={styles.infoItem}>
                    <h6></h6>
                    <p>XGRAV/PUFF</p>
                    <h3>x{formatAmount(voyage.amount)}</h3>
                  </div>
                  <div className={styles.infoItem}>
                    <h6></h6>
                    <p>INDIVIDUALLY?</p>
                    <h3>
                      <span
                        className={
                          voyage.tokens.length === 1 ? styles.active : ''
                        }
                      >
                        Y
                      </span>
                      /
                      <span
                        className={
                          voyage.tokens.length === 1 ? '' : styles.active
                        }
                      >
                        N
                      </span>
                    </h3>
                  </div>
                </div>
                <div className={styles.stakeResult}>
                  <div className={styles.infoItem}></div>
                  <div className={styles.infoItem}>
                    <h6></h6>
                    <h4>
                      VOYAGE
                      <br />
                      RESULT
                    </h4>
                  </div>
                  <div className={styles.infoItem}>
                    <h6></h6>
                    <p>SUCCESSFUL</p>
                    <p>PUFF(S)</p>
                    <h5>
                      <span className={styles.blue}>
                        {isWin ? formatAmount(voyage.tokens.length) : 0}
                      </span>
                      /{formatAmount(voyage.tokens.length)}
                    </h5>
                  </div>
                  <div className={styles.infoItem}>
                    <h6></h6>
                    <p>SUCCESSFUL</p>
                    <p>
                      <span className={styles.yellow}>XGRAV</span>
                      <IconSwap /> <span className={styles.purple}>GRAV</span>
                    </p>
                    <h5>
                      <span className={styles.purple}>
                        {isWin
                          ? formatAmount(voyage.tokens.length * voyage.amount)
                          : 0}
                      </span>
                      /{formatAmount(voyage.tokens.length * voyage.amount)}
                    </h5>
                  </div>
                </div>
              </div>
            )}
            <FeeBox incompleted={!completed} />
          </div>
        </>
      ) : (
        <>
          <h3>ALL VOYAGES</h3>
          <div className={styles.activeVoyageBox}>
            <div className={styles.contentBox}>
              <div className={styles.activeVoyageItem}>
                <div className={styles.info}>
                  <h1>
                    <span className={styles.blue}>
                      {completedVoyages.length}
                    </span>{' '}
                    VOYAGES COMPLETE
                  </h1>
                  <p>
                    END <span className={styles.blue}>2</span> VOYAGES AND SEE
                    IF YOU WERE SUCCESSFUL!
                  </p>
                </div>
                <button
                  className={styles.btn}
                  disabled={completedVoyages.length === 0 || isProcess}
                  onClick={() => {
                    endVoyages(completedVoyages, true);
                  }}
                >
                  {idsInProcess &&
                  completedVoyages.length > 0 &&
                  isContentProcess &&
                  idsInProcess.includes(completedVoyages[0]) ? (
                    <p>
                      <ClipLoader
                        color="currentColor"
                        size={36}
                        loading={
                          completedVoyages.length > 0 &&
                          isContentProcess &&
                          idsInProcess.includes(completedVoyages[0])
                        }
                      />
                    </p>
                  ) : (
                    <p>
                      END
                      <br />
                      VOYAGES
                    </p>
                  )}
                </button>
              </div>
              <div
                className={`${styles.activeVoyageItem} ${styles.inComplete}`}
              >
                <div className={styles.info}>
                  <h1>
                    <span>{inCompletedVoyages.length}</span> ACTIVE VOYAGES
                  </h1>
                  <p>
                    END <span>{inCompletedVoyages.length}</span> VOYAGES EARLY
                    AND FORFEIT REWARDS.
                  </p>
                </div>
                <button
                  className={styles.btn}
                  disabled={inCompletedVoyages.length === 0}
                  onClick={() => {
                    endVoyages(inCompletedVoyages, false);
                  }}
                >
                  {idsInProcess &&
                  inCompletedVoyages.length > 0 &&
                  isContentProcess &&
                  idsInProcess.includes(inCompletedVoyages[0]) ? (
                    <p>
                      <ClipLoader
                        color="currentColor"
                        size={36}
                        loading={
                          inCompletedVoyages.length > 0 &&
                          isContentProcess &&
                          idsInProcess.includes(inCompletedVoyages[0])
                        }
                      />
                    </p>
                  ) : (
                    <p>
                      END VOYAGES
                      <br />
                      EARLY
                    </p>
                  )}
                </button>
              </div>
            </div>
            <FeeBox />
          </div>
        </>
      )}
    </div>
  );
};

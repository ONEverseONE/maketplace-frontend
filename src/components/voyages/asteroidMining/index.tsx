import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BorderActiveTab,
  IconCloseSm,
  IconQuestion,
  IconONEverse,
  IconTriangle,
} from '../../ui/icons';
import { WalletBox } from '../../ui/walletBox';
import styles from './AsteroidMining.module.scss';
import { CargoSize } from './cargoSize';
import { NewVoyageContent } from './content/newVoyageContent';
import { LogData, LogItem } from './logItem';
import { NftData, NftItem } from './nftItem';

import { VoyageData, VoyageItem } from './voyageItem';
import {
  CONTRACT_NFT,
  CONTRACT_Voyager,
  CONTRACT_xGrav,
  NFT_IMAGE_URL,
} from '../../../constant';
import { ABI_NFT, ABI_Voyage, ABI_xGrav } from '../../../constant/abis';
import { checkStakeEnd, setupMultiCallContract } from '../../../utils';
import { toast } from 'react-toastify';
import { ActiveVoyagesContent } from './content/activeVoyagesContent';
import { LogContent } from './content/logContent';
import { ClipLoader } from 'react-spinners';
import { NFT_INFO } from '../../../constant/puff';

export const AsteroidMining: React.FC = () => {
  const { account, active, library } = useWeb3React();
  const individualCheckBox = useRef<HTMLInputElement | null>(null);

  const [currentTab, setCurrentTab] = useState<string>('NEW VOYAGE');
  const [isXGravApproved, setIsXGravApproved] = useState<boolean>(false);
  const [isNftApproved, setIsNftApproved] = useState<boolean>(false);
  const [cargoSize, setCargoSize] = useState<number>(1);

  const [logs, setLogs] = useState<LogData[]>([]);
  const [selectedLog, setSelectedLog] = useState<number>(-1);

  const [nfts, setNfts] = useState<NftData[]>([]);
  const [selectedNfts, setSelectedNfts] = useState<number[]>([]);

  const [voyages, setVoyages] = useState<VoyageData[]>([]);
  const [oldVoyage, setOldVoyage] = useState<VoyageData>({
    id: 0,
    stakedTime: 0,
    amount: 1,
    img: '',
    tokens: [],
  });
  const [selectedVoyage, setSelectedVoyage] = useState<number>(-1);
  const [completedVoyages, setCompletedVoyages] = useState<number[]>([]);
  const [inCompletedVoyages, setInCompletedVoyages] = useState<number[]>([]);
  const [unSettedRarities, setUnSettedRarities] = useState<number[]>([]);
  const [isWin, setIsWin] = useState<boolean | null>(null);

  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [isClaimProcess, setIsClaimProcess] = useState<boolean>(false);
  const [idsInProcess, setIdsInProcess] = useState<number[] | null>(null);
  const [isStartProcess, setIsStartProcess] = useState<boolean>(false);
  const [isContentProcess, setIsContentProcess] = useState<boolean>(false);

  useEffect(() => {
    setIsProcess(!isXGravApproved || !isNftApproved || isClaimProcess);
  }, [isClaimProcess, isXGravApproved, isNftApproved]);

  let timeout: any = null;

  const updateSelectedNfts = (tokenId: number) => {
    const index = selectedNfts.indexOf(tokenId);
    setSelectedNfts(
      index > -1
        ? selectedNfts.filter((x) => x !== tokenId)
        : [...selectedNfts, tokenId]
    );
  };

  const getAllNfts = async () => {
    if (!account) return;
    try {
      const contract = new Contract(CONTRACT_NFT, ABI_NFT, library.getSigner());

      const nftCount = Number(await contract.balanceOf(account));
      const [multicallProvider, multicallContract] =
        await setupMultiCallContract(CONTRACT_NFT, ABI_NFT, library);
      const multiContract: any = multicallContract;
      const nftIds = await multicallProvider.all(
        Array.from(Array(nftCount).keys()).map((u) =>
          multiContract.tokenOfOwnerByIndex(account, u)
        )
      );
      setNfts(
        nftIds.map((id: BigNumber) => ({
          tokenId: Number(id),
          rarity: NFT_INFO[Number(id) - 1].nftRarity,
          signature: NFT_INFO[Number(id) - 1].signature,
          img: `${NFT_IMAGE_URL}${Number(id)}.png`,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };
  const getActiveVoyages = async () => {
    if (!account) return;
    try {
      const contract = new Contract(
        CONTRACT_Voyager,
        ABI_Voyage,
        library.getSigner()
      );

      const activeVoyageIds = await contract.getUserStaked(account);

      const [multicallProvider, multicallContract] =
        await setupMultiCallContract(CONTRACT_Voyager, ABI_Voyage, library);
      const multiContract: any = multicallContract;
      const res = await multicallProvider.all(
        activeVoyageIds.map((id: number) =>
          multiContract.getStakeInfo(account, id)
        )
      );
      setVoyages(
        res.map((item: any, index: number) => ({
          id: Number(activeVoyageIds[index]),
          amount: Number(item.amount),
          stakedTime: Number(item.timestaked),
          tokens: item.tokens.map((token: any) => Number(token)),
          img: `${NFT_IMAGE_URL}${Number(activeVoyageIds[index])}.png`,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };
  const getLogs = async () => {
    if (!account) return;
    try {
      const contract = new Contract(
        CONTRACT_Voyager,
        ABI_Voyage,
        library.getSigner()
      );

      const endVoyageCount = Number(await contract.getUserEnded(account));

      const [multicallProvider, multicallContract] =
        await setupMultiCallContract(CONTRACT_Voyager, ABI_Voyage, library);
      const multiContract: any = multicallContract;
      const voyageIds = await multicallProvider.all(
        Array.from(Array(endVoyageCount).keys()).map((id: number) =>
          multiContract.userEnded(account, id)
        )
      );
      const res = await multicallProvider.all(
        voyageIds.map((id: number) => multiContract.getResult(account, id))
      );
      setLogs(
        res.map((item: any, index: number) => ({
          id: Number(voyageIds[index]),
          xgravPerPuff: Number(item.amount),
          amount: item.tokens.length,
          win: item.win,
          tokens: item.tokens.map((token: any) => Number(token)),
          img: `${NFT_IMAGE_URL}${Number(voyageIds[index])}.png`,
        }))
      );
      setSelectedLog(voyageIds.length > 0 ? 0 : -1);
    } catch (err) {
      console.log(err);
    }
  };

  const checkXGravApprove = async () => {
    try {
      const xGravContract = new Contract(
        CONTRACT_xGrav,
        ABI_xGrav,
        library.getSigner()
      );
      const allowance: BigNumber = await xGravContract.allowance(
        account,
        CONTRACT_Voyager
      );
      const totalSupply: BigNumber = await xGravContract.totalSupply();

      setIsXGravApproved(allowance.gt(totalSupply));
    } catch (err) {
      console.log(err);
      setIsXGravApproved(false);
    }
  };

  const checkNftApprove = async () => {
    try {
      const nftContract = new Contract(
        CONTRACT_NFT,
        ABI_NFT,
        library.getSigner()
      );
      const isApproved: boolean = await nftContract.isApprovedForAll(
        account,
        CONTRACT_Voyager
      );

      setIsNftApproved(isApproved);
    } catch (err) {
      console.log(err);
      setIsNftApproved(false);
    }
  };

  const checkRarities = async () => {
    try {
      const contract = new Contract(CONTRACT_Voyager, ABI_Voyage, library);
      const rarityList: any[] = [];
      await Promise.all(
        nfts.map(async (nft) => {
          if (Number(await contract.tokenRarity(nft.tokenId)) === 0)
            rarityList.push({
              tokenId: nft.tokenId,
              rarity: nft.rarity,
              signature: nft.signature,
            });
        })
      );
      setUnSettedRarities(rarityList);
    } catch (err) {
      console.log(err);
    }
  };

  const approveXGravForAll = async () => {
    try {
      const xGravContract = new Contract(
        CONTRACT_xGrav,
        ABI_xGrav,
        library.getSigner()
      );
      const res = await xGravContract.approve(
        CONTRACT_Voyager,
        BigNumber.from(2).pow(256).sub(1)
      );

      await res.wait();
      setIsXGravApproved(true);
    } catch (err) {
      console.log(err);
      setIsXGravApproved(false);
    }
  };
  const approveNftForAll = async () => {
    try {
      const nftContract = new Contract(
        CONTRACT_NFT,
        ABI_NFT,
        library.getSigner()
      );
      const res = await nftContract.setApprovalForAll(CONTRACT_Voyager, true);

      await res.wait();
      setIsNftApproved(true);
    } catch (err) {
      console.log(err);
      setIsNftApproved(false);
    }
  };

  const initializePuff = async () => {
    if (!active) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsStartProcess(true);
      const contract = new Contract(
        CONTRACT_Voyager,
        ABI_Voyage,
        library.getSigner()
      );
      const res = await contract.initializePuff(unSettedRarities);
      await res.wait();

      setUnSettedRarities([]);
    } catch (err) {
      console.log(err);
      const msg = JSON.parse(JSON.stringify(err));
      toast.error(
        msg.data
          ? msg.data.message
          : msg.message ?? 'Something went wrong, please retry'
      );
    } finally {
      setIsStartProcess(false);
    }
  };

  const startVoyage = async () => {
    if (!active) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (selectedNfts.length === 0) {
      toast.error('Please select at least one PUFF');
      return;
    }

    try {
      setIsStartProcess(true);
      const isChecked = individualCheckBox.current?.checked;
      let tokenIds = [];
      let prices = [];
      if (isChecked) {
        for (let i = 0; i < selectedNfts.length; i++) {
          tokenIds.push([selectedNfts[i]]);
          prices.push(cargoSize);
        }
      } else {
        tokenIds.push(selectedNfts);
        prices.push(cargoSize);
      }

      const contract = new Contract(
        CONTRACT_Voyager,
        ABI_Voyage,
        library.getSigner()
      );
      const res = await contract.startVoyage(tokenIds, prices);
      await res.wait();

      setSelectedNfts([]);
      getAllNfts();
    } catch (err) {
      console.log(err);
      const msg = JSON.parse(JSON.stringify(err));
      toast.error(
        msg.data
          ? msg.data.message
          : msg.message ?? 'Something went wrong, please retry'
      );
    } finally {
      setIsStartProcess(false);
    }
  };

  const claimVoyage = async (
    ids: number[],
    isEarly: boolean,
    isAll?: boolean
  ) => {
    if (!active) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsClaimProcess(true);
      setIdsInProcess(isAll ? null : ids);
      const contract = new Contract(
        CONTRACT_Voyager,
        ABI_Voyage,
        library.getSigner()
      );
      const res = isEarly
        ? await contract.endEarly(ids)
        : await contract.endVoyage(ids);
      setIsWin(!isEarly);
      timeout = setTimeout(() => {
        setIsWin(null);
      }, 10000);
      await res.wait();

      if (ids.includes(selectedVoyage)) setSelectedVoyage(-1);
      getActiveVoyages();
    } catch (err) {
      console.log(err);
      const msg = JSON.parse(JSON.stringify(err));
      toast.error(
        msg.data
          ? msg.data.message
          : msg.message ?? 'Something went wrong, please retry'
      );
    } finally {
      setIsClaimProcess(false);
      setIdsInProcess(null);
      setIsContentProcess(false);
    }
  };

  useEffect(() => {
    if (active) {
      if (currentTab === 'NEW VOYAGE') {
        getAllNfts();
      } else if (currentTab === 'ACTIVE VOYAGES') {
        getActiveVoyages();
      } else {
        getLogs();
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentTab, active]);

  useEffect(() => {
    if (active) {
      checkXGravApprove();
      checkNftApprove();
    }
  }, [active]);

  useEffect(() => {
    setCompletedVoyages(
      voyages.filter((voyage) => checkStakeEnd(voyage)).map((item) => item.id)
    );
    setInCompletedVoyages(
      voyages.filter((voyage) => !checkStakeEnd(voyage)).map((item) => item.id)
    );
  }, [voyages]);

  useEffect(() => {
    checkRarities();
  }, [nfts]);

  return (
    <div
      className={`${styles.miningPage} ${
        currentTab === 'LOG' ? styles.logPage : ''
      }`}
    >
      <div className={styles.url}>
        <p>\\ONEVERSE\VOYAGES_V1.0\mining-ONE.EXE</p>
        <Link to="/voyages" className={styles.close}>
          <IconCloseSm />
        </Link>
      </div>
      <div className={styles.header}>
        <div className={styles.miningLeft}>
          <WalletBox />
          <div className={styles.title}>
            <p>VOYAGES_V1.0</p>
            <h1>ASTEROID-MINING</h1>
          </div>
        </div>
        <div className={styles.miningRight}>{currentTab}</div>
      </div>
      <div className={styles.miningBox}>
        <div className={styles.miningLeft}>
          <div className={`${styles.tabs} ${styles.border}`}>
            <div
              className={currentTab === 'NEW VOYAGE' ? styles.active : ''}
              onClick={() => {
                setCurrentTab('NEW VOYAGE');
              }}
            >
              NEW VOYAGE
              {currentTab === 'NEW VOYAGE' && <BorderActiveTab />}
            </div>
            <div
              className={currentTab === 'ACTIVE VOYAGES' ? styles.active : ''}
              onClick={() => {
                setCurrentTab('ACTIVE VOYAGES');
              }}
            >
              ACTIVE VOYAGES
              {currentTab === 'ACTIVE VOYAGES' && <BorderActiveTab />}
            </div>
            <div
              className={`${styles.log} ${
                currentTab === 'LOG' ? styles.active : ''
              }`}
              onClick={() => {
                setCurrentTab('LOG');
              }}
            >
              LOG
              {currentTab === 'LOG' && <BorderActiveTab isLog />}
            </div>
          </div>
          <div className={`${styles.voyages} ${styles.border}`}>
            <div className={styles.voyagesBox}>
              {currentTab === 'NEW VOYAGE'
                ? nfts
                    .sort((a, b) => a.tokenId - b.tokenId)
                    .map((item: NftData, index: number) => (
                      <NftItem
                        key={`nft-${index}`}
                        nft={item}
                        selected={selectedNfts.includes(item.tokenId)}
                        clickHandler={updateSelectedNfts}
                      />
                    ))
                : currentTab === 'ACTIVE VOYAGES'
                ? voyages
                    .sort((a, b) => a.stakedTime - b.stakedTime)
                    .map((item: VoyageData, index: number) => (
                      <VoyageItem
                        key={`voyage-${index}`}
                        voyage={item}
                        selected={selectedVoyage === item.id}
                        isProgress={isProcess}
                        isSpinning={
                          idsInProcess?.length === 1 &&
                          !isContentProcess &&
                          idsInProcess.includes(item.id)
                        }
                        endHandler={claimVoyage}
                        selectHandler={() =>
                          setSelectedVoyage(
                            item.id === selectedVoyage ? -1 : item.id
                          )
                        }
                      />
                    ))
                : logs.map((item: LogData, index: number) => (
                    <LogItem
                      key={`log-${index}`}
                      log={item}
                      selected={index === selectedLog}
                      clickHandler={() => {
                        setSelectedLog(index);
                      }}
                    />
                  ))}
            </div>
          </div>
          {currentTab !== 'LOG' && (
            <div className={styles.selectedCount}>
              <IconTriangle />
              <div className={styles.countBox}>
                {currentTab === 'NEW VOYAGE' ? (
                  <>
                    <p>
                      <span>{selectedNfts.length}</span> PUFFS SELECTED
                    </p>
                    <button
                      className={styles.selectBtn}
                      onClick={() => {
                        setSelectedNfts(
                          selectedNfts.length === nfts.length
                            ? []
                            : nfts.map((x) => x.tokenId)
                        );
                      }}
                    >
                      {selectedNfts.length === nfts.length ? 'DE' : ''}SELECT
                      ALL
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      <span>{completedVoyages.length}</span> CLAIMABLE VOYAGES
                    </p>
                    <button
                      className={styles.selectBtn}
                      disabled={completedVoyages.length === 0 || isProcess}
                      onClick={() => {
                        claimVoyage(completedVoyages, false, true);
                      }}
                    >
                      {isClaimProcess && !idsInProcess ? (
                        <ClipLoader
                          color="currentColor"
                          loading={isClaimProcess}
                        />
                      ) : (
                        'CLAIM ALL'
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={styles.miningRight}>
          <div className={styles.rightContent}>
            <div className={styles.question}>
              <IconQuestion
                isLog={currentTab === 'LOG'}
                isNew={currentTab === 'NEW VOYAGE'}
              />
            </div>
            {currentTab === 'NEW VOYAGE' ? (
              <NewVoyageContent />
            ) : currentTab === 'ACTIVE VOYAGES' ? (
              <ActiveVoyagesContent
                isWin={isWin}
                oldVoyage={oldVoyage}
                nowVoyage={
                  selectedVoyage === -1
                    ? null
                    : voyages.filter((item) => item.id === selectedVoyage)[0]
                }
                completedVoyages={completedVoyages}
                inCompletedVoyages={inCompletedVoyages}
                isProcess={isProcess}
                idsInProcess={idsInProcess}
                isContentProcess={isContentProcess}
                endVoyages={(items: number[], completed: boolean) => {
                  setIsContentProcess(true);
                  claimVoyage(items, !completed);
                }}
              />
            ) : (
              <LogContent log={selectedLog === -1 ? null : logs[selectedLog]} />
            )}
          </div>
          <div className={styles.rightFooter}>
            {isXGravApproved && isNftApproved ? (
              currentTab === 'NEW VOYAGE' ? (
                <>
                  <CargoSize
                    currentSize={cargoSize}
                    clickHandler={(val) => {
                      setCargoSize(val);
                    }}
                  />
                  <div className={styles.footerRight}>
                    <div className={styles.triangle}>
                      <IconTriangle />
                    </div>
                    <div className={styles.footerRightBox}>
                      {unSettedRarities.length === 0 ? (
                        <button
                          className={styles.startBtn}
                          disabled={selectedNfts.length === 0 || isStartProcess}
                          onClick={startVoyage}
                        >
                          <p>
                            {isStartProcess ? (
                              <ClipLoader
                                color="currentColor"
                                loading={isStartProcess}
                              />
                            ) : (
                              'START VOYAGE'
                            )}
                          </p>
                        </button>
                      ) : (
                        <button
                          className={styles.startBtn}
                          disabled={
                            unSettedRarities.length === 0 || isStartProcess
                          }
                          onClick={initializePuff}
                        >
                          <p>
                            {isStartProcess ? (
                              <ClipLoader
                                color="currentColor"
                                loading={isStartProcess}
                              />
                            ) : (
                              'SET RARITIES'
                            )}
                          </p>
                        </button>
                      )}
                      <input
                        ref={individualCheckBox}
                        type="checkbox"
                        id="stakeIndividually"
                        name="stakeIndividually"
                      />
                      <label htmlFor="stakeIndividually">
                        STAKE PUFFS INDIVIDUALLY
                      </label>
                    </div>
                  </div>
                </>
              ) : currentTab === 'ACTIVE VOYAGES' ? (
                <div className={styles.activeRightFooter}>
                  <div className={styles.bgLight}></div>
                  <IconONEverse />
                </div>
              ) : (
                <div className={styles.activeRightFooter}>
                  <div className={styles.bgLogLight}></div>
                  <div className={styles.oneVerse}>
                    <IconONEverse isLog />
                  </div>
                </div>
              )
            ) : (
              <button
                className={styles.approveBtn}
                disabled={isXGravApproved && isNftApproved}
                onClick={() => {
                  if (!isXGravApproved) approveXGravForAll();
                  if (!isNftApproved) approveNftForAll();
                }}
              >
                <p>
                  {isStartProcess ? (
                    <ClipLoader color="currentColor" loading={isStartProcess} />
                  ) : (
                    'APPROVE XGRAV'
                  )}
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

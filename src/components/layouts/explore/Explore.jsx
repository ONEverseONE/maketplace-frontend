/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ExploreItem from './ExploreItem';
import Switch from "react-switch";

import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { CONTRACT_NFT_PUFF, CONTRACT_MARKETPLACE, ZERO_ADDRESS, PUFF_IMAGE_URL } from '../../../constant/index.js';
import { ABI_NFT_PUFF, ABI_MARKETPLACE } from '../../../constant/abis.js';
import { setupMultiCallContract } from '../../../utils';
import { formatEther } from '@ethersproject/units';
import { PUFF_RARITY } from '../../../constant/puff.js'
import { GQL_GETMYLISTED } from '../../../constant/gqls';
import { useQuery } from '@apollo/client';

const Explore = () => {
    const count = 12;
    const { account, library } = useWeb3React();

    const [status, setStatus] = useState([{ field: 'Buy Now', checked: true }, { field: 'On Auctions', checked: true }]);
    const [isMine, setIsMine] = useState(false);
    const [isListing, setIsListing] = useState(false);

    // const [myNftIdsNotList, setMyNftIdsNotList] = useState([]);
    // const [myNftIdsList, setMyNftIdsList] = useState([]);

    const [startNft, setStartNft] = useState(0);
    const [nfts, setNfts] = useState([]);

    const updateStatus = (val) => {
        setStatus(status.map(item => item.field === val.field ? val : item));
    }

    const getAllNfts = async (start) => {
        if (!library) {
            console.log('No provider');
            return;
        }
        try {
            const contract = new Contract(CONTRACT_NFT_PUFF , ABI_NFT_PUFF, library);

            const nftCount = Number(await contract.totalSupply());

            const [multicallProvider, multicallContract] =
                await setupMultiCallContract(CONTRACT_NFT_PUFF, ABI_NFT_PUFF, library);
            const possibleCount = Math.min(count, nftCount - start);
            const nftIds = await multicallProvider.all(
                Array.from(Array(possibleCount).keys()).map((u, index) =>
                    multicallContract.tokenByIndex(start + index)
                )
            );

            const owners = await multicallProvider.all(
                nftIds.map((id) =>
                    multicallContract.ownerOf(id)
                )
            );

            const [multicallMarketProvider, multicallMarketContract] =
                await setupMultiCallContract(CONTRACT_MARKETPLACE, ABI_MARKETPLACE, library);

            const listed = await multicallMarketProvider.all(
                nftIds.map((id) =>
                    multicallMarketContract.listed(id)
                )
            );

            const infos = await multicallMarketProvider.all(
                listed.map((listed, index) =>
                    (Number(listed) === 1) ?
                        multicallMarketContract.directSales(nftIds[index])
                        : multicallMarketContract.auctionSales(nftIds[index])
                )
            );
            const newNfts = infos.map((info, index) => ({
                id: Number(nftIds[index]),
                img: `${PUFF_IMAGE_URL}${Number(nftIds[index])}.png`,
                rarity: PUFF_RARITY[Number(nftIds[index]) - 1].nftRarity,
                currentOwner: owners[index],
                listed: Number(listed[index]),
                originalOwner: info.owner,
                price: Number(listed[index]) === 1 ? Number(formatEther(info.price)) : 0,
                highestBid: Number(listed[index]) === 2 ? Number(info.highestBid) : 0,
                highestBidder: Number(listed[index]) === 2 ? Number(info.highestBidder) : ZERO_ADDRESS,
                timeEnd: Number(listed[index]) === 2 ? Number(info.timeEnd) : 0,
            }))
            console.log(newNfts)
            setNfts(start === 0 ? newNfts : [...nfts, ...newNfts]);
            setStartNft(start + possibleCount);
        } catch (err) {
            console.log(err);
        }
    }

    const getListedNfts = async (start) => {
        if (!library) {
            console.log('No provider');
            return;
        }
        try {
            const contract = new Contract(CONTRACT_NFT_PUFF , ABI_NFT_PUFF, library);

            const nftCount = Number(await contract.balanceOf(CONTRACT_MARKETPLACE));

            const [multicallProvider, multicallContract] =
                await setupMultiCallContract(CONTRACT_NFT_PUFF, ABI_NFT_PUFF, library);
            const possibleCount = Math.min(count, nftCount - start);
            const nftIds = await multicallProvider.all(
                Array.from(Array(possibleCount).keys()).map((u, index) =>
                    multicallContract.tokenOfOwnerByIndex(CONTRACT_MARKETPLACE, start + index)
                )
            );

            const [multicallMarketProvider, multicallMarketContract] =
                await setupMultiCallContract(CONTRACT_MARKETPLACE, ABI_MARKETPLACE, library);

            const listed = await multicallMarketProvider.all(
                nftIds.map((id) =>
                    multicallMarketContract.listed(id)
                )
            );

            const infos = await multicallMarketProvider.all(
                listed.map((listed, index) =>
                    (Number(listed) === 1) ?
                        multicallMarketContract.directSales(nftIds[index])
                        : multicallMarketContract.auctionSales(nftIds[index])
                )
            );
            const newNfts = infos.map((info, index) => ({
                id: Number(nftIds[index]),
                img: `${PUFF_IMAGE_URL}${Number(nftIds[index])}.png`,
                rarity: PUFF_RARITY[Number(nftIds[index]) - 1].nftRarity,
                currentOwner: CONTRACT_MARKETPLACE,
                listed: Number(listed[index]),
                originalOwner: info.owner,
                price: Number(listed[index]) === 1 ? Number(formatEther(info.price)) : 0,
                highestBid: Number(listed[index]) === 2 ? Number(formatEther(info.highestBid)) : 0,
                highestBidder: Number(listed[index]) === 2 ? Number(info.highestBidder) : ZERO_ADDRESS,
                timeEnd: Number(listed[index]) === 2 ? Number(info.timeEnd) : 0,
            }))
            console.log(newNfts)
            setNfts(start === 0 ? newNfts : [...nfts, ...newNfts]);
            setStartNft(start);
        } catch (err) {
            console.log(err);
        }
    }

    const { loading, error, data, refetch } = useQuery(GQL_GETMYLISTED, {
        variables: { address: account?.toLowerCase() },
        fetchPolicy: 'no-cache',
    });
    useEffect(() => {
        // setIsLoadingProcessing(loading);
    
        if (error) {
          console.log(error);
        }
    
        console.log('loading nfts...');
    
        if (!loading && data) {
            console.log('##############', data)
        //   getStatus(data);
        }
      }, [loading, error, data]);

    // const getMyNftIdsNotList = async () => {
    //     const contract = new Contract(CONTRACT_NFT_PUFF , ABI_NFT_PUFF, library);

    //     const nftCount = Number(await contract.balanceOf(account));

    //     const [multicallProvider, multicallContract] =
    //         await setupMultiCallContract(CONTRACT_NFT_PUFF, ABI_NFT_PUFF, library);
    //     const nftIds = await multicallProvider.all(
    //         Array.from(Array(nftCount).keys()).map((u) =>
    //             multicallContract.tokenByIndex(u)
    //         )
    //     );
    // }

    // const getMyNfts = async (start) => {
    //     if (!library) {
    //         console.log('No provider');
    //         return;
    //     }
    //     try {
    //         const contract = new Contract(CONTRACT_NFT_PUFF , ABI_NFT_PUFF, library);

    //         const nftCount = Number(await contract.balanceOf(account));

    //         const [multicallProvider, multicallContract] =
    //             await setupMultiCallContract(CONTRACT_NFT_PUFF, ABI_NFT_PUFF, library);
    //         const possibleCount = Math.min(count, nftCount - start);
    //         const nftIds = await multicallProvider.all(
    //             Array.from(Array(possibleCount).keys()).map((u, index) =>
    //                 multicallContract.tokenByIndex(start + index)
    //             )
    //         );

    //         const owners = await multicallProvider.all(
    //             nftIds.map((id) =>
    //                 multicallContract.ownerOf(id)
    //             )
    //         );

    //         const [multicallMarketProvider, multicallMarketContract] =
    //             await setupMultiCallContract(CONTRACT_MARKETPLACE, ABI_MARKETPLACE, library);

    //         const listed = await multicallMarketProvider.all(
    //             nftIds.map((id) =>
    //                 multicallMarketContract.listed(id)
    //             )
    //         );

    //         const infos = await multicallMarketProvider.all(
    //             listed.map((listed, index) =>
    //                 (Number(listed) === 1) ?
    //                     multicallMarketContract.directSales(nftIds[index])
    //                     : multicallMarketContract.auctionSales(nftIds[index])
    //             )
    //         );
    //         const newNfts = infos.map((info, index) => ({
    //             id: Number(nftIds[index]),
    //             currentOwner: owners[index],
    //             listed: Number(listed[index]),
    //             originalOwner: info.owner,
    //             price: Number(listed[index]) === 1 ? info.price : 0,
    //             highestBid: Number(listed[index]) === 2 ? info.highestBid : 0,
    //             highestBidder: Number(listed[index]) === 2 ? info.highestBidder : ZERO_ADDRESS,
    //             timeEnd: Number(listed[index]) === 2 ? info.timeEnd : 0,
    //         }))
    //         console.log(newNfts)
    //         setNfts(start === 0 ? newNfts : [...nfts, ...newNfts]);
    //         setStartNft(start + possibleCount);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    const getMore = (start) => {
        if (isMine) { } else {
            if (isListing) getListedNfts(start);
            getAllNfts(start);
        }
    }

    useEffect(() => {
        if (library) {
            getMore(startNft)
        }
    },[library])

    // const temp = async () => {
    //   const rarities = await Promise.all(
    //     Array(1000)
    //       .fill(0)
    //       .map((u: any, ids: number) => getNftRarity(8000+ids))
    //     );
    //     console.log(rarities)
    // };
    // useEffect(() => {
    //     temp();
    // }, [])

    return (
        <section className="tf-explore tf-section">
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-12">
                        <div id="side-bar" className="side-bar style-3">
                            <div className="widget widget-category mgbt-24 boder-bt">
                                <div className="nft-switch">
                                    My NFT
                                    <Switch
                                        onChange={() => { setIsMine(!isMine) }}
                                        checked={isMine}
                                        disabled={false}
                                        height={24}
                                    />
                                </div>
                            </div>
                            <div className="widget widget-category mgbt-24">
                                <div className="nft-switch">
                                    All / Listing
                                    <Switch
                                        onChange={() => {
                                            if (!isListing)
                                                getListedNfts(0);
                                            else
                                                getAllNfts(0);
                                            setIsListing(!isListing);
                                        }}
                                        checked={isListing}
                                        disabled={false}
                                        checkedIcon={false}
                                        uncheckedIcon={false}
                                        onColor="#5142FC"
                                        offColor="#E13F71"
                                        height={24}
                                    />
                                </div>
                            </div>
                            <div className="widget widget-category mgbt-24 boder-bt">
                                {isListing &&
                                    <div className="content-wg-category">
                                        {/* <Accordion title="Status" show={true}> */}
                                        <form action="#">
                                            {
                                                status.map((itemm, index) => (
                                                    <div key={`status-${index}`}>
                                                        <label>{itemm.field}
                                                            <input type="checkbox" defaultChecked={itemm.checked} onChange={(e) => { updateStatus({ ...itemm, checked: e.target.checked }) }} />
                                                            <span className="btn-checkbox"></span>
                                                        </label><br />
                                                    </div>
                                                ))
                                            }
                                        </form>
                                        {/* </Accordion> */}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-xl-9 col-lg-9 col-md-12">
                        <ExploreItem data={nfts} getMore={() => {getMore(startNft)}} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Explore;

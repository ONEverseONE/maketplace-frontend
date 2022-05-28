import React, { useState, useEffect } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link } from 'react-router-dom';
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel  } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import liveAuctionData from '../assets/fake-data/data-live-auction';
import LiveAuction from '../components/layouts/LiveAuction';
import img1 from '../assets/images/avatar/avt-3.jpg'
import img2 from '../assets/images/avatar/avt-11.jpg'
import img3 from '../assets/images/avatar/avt-1.jpg'
import img4 from '../assets/images/avatar/avt-5.jpg'
import img5 from '../assets/images/avatar/avt-7.jpg'
import img6 from '../assets/images/avatar/avt-8.jpg'
import imgdetail1 from '../assets/images/box-item/images-item-details.jpg'
import { useParams } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { CONTRACT_NFT_PUFF, CONTRACT_MARKETPLACE, PUFF_IMAGE_URL, ZERO_ADDRESS } from '../constant';
import { PUFF_RARITY } from '../constant/puff.js'
import { ABI_MARKETPLACE, ABI_NFT_PUFF } from '../constant/abis.js'
import { setupMultiCallContract, shortAddress } from '../utils';
import { formatEther } from '@ethersproject/units';
import Switch from "react-switch";
import InputMask from 'react-input-mask';

const ItemDetails01 = () => {
    const [dataHistory] = useState(
        [
            {
                img: img1,
                name:"Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img2,
                name:"Mason Woodward",
                time: "at 06/10/2021, 3:20 AM",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img3,
                name:"Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img4,
                name:"Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img5,
                name:"Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img6,
                name:"Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
        ]
    )
    const { nftId } = useParams();
    const { account, library } = useWeb3React();

    const [isAuction, setIsAuction] = useState(false);
    const [fixPrice, setFixPrice] = useState(0);
    
    const [nft, setNft] = useState({
        id: Number(nftId),
        img: `${PUFF_IMAGE_URL}${nftId}.png`,
        rarity: PUFF_RARITY[Number(nftId) - 1].nftRarity,
        currentOwner: '',
        listed: 0,
    })
    // const [ethPrice, setEthPrice] = useState(2000);

    // useEffect(() => {
    //     fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`).then(res => {
    //         res.json().then(res => {
    //             setEthPrice(res.ethereum.usd)
    //         }).catch(err=>console.log(err))
    //     }).catch(err=>console.log(err))
    // }, [])
    const getNftInfo = async () => {
        try {
            const contract = new Contract(CONTRACT_NFT_PUFF, ABI_NFT_PUFF, library);
            const currentOwner = await contract.ownerOf(nftId);
            const [multicallMarketProvider, multicallMarketContract] =
            await setupMultiCallContract(CONTRACT_MARKETPLACE, ABI_MARKETPLACE, library);
            const [listed, saleInfo, auctionInfo] = await multicallMarketProvider.all(
                [
                    multicallMarketContract.listed(nftId),
                    multicallMarketContract.directSales(nftId),
                    multicallMarketContract.auctionSales(nftId),
                ]
            );
            console.log({
                id: Number(nftId),
                img: `${PUFF_IMAGE_URL}${nftId}.png`,
                rarity: PUFF_RARITY[Number(nftId) - 1].nftRarity,
                currentOwner: currentOwner,
                listed: Number(listed),
                originalOwner: Number(listed) === 1 ? saleInfo.owner : auctionInfo.owner,
                price: Number(listed) === 1 ? Number(formatEther(saleInfo.price)) : 0,
                highestBid: Number(listed) === 2 ? Number(auctionInfo.highestBid) : 0,
                highestBidder: Number(listed) === 2 ? Number(auctionInfo.highestBidder) : ZERO_ADDRESS,
                timeEnd: Number(listed) === 2 ? Number(auctionInfo.timeEnd) * 1000 : 0,
            })
            setNft({
                id: Number(nftId),
                img: `${PUFF_IMAGE_URL}${nftId}.png`,
                rarity: PUFF_RARITY[Number(nftId) - 1].nftRarity,
                currentOwner: currentOwner,
                listed: Number(listed),
                originalOwner: Number(listed) === 1 ? saleInfo.owner : auctionInfo.owner,
                price: Number(listed) === 1 ? Number(formatEther(saleInfo.price)) : 0,
                highestBid: Number(listed) === 2 ? Number(auctionInfo.highestBid) : 0,
                highestBidder: Number(listed) === 2 ? Number(auctionInfo.highestBidder) : ZERO_ADDRESS,
                timeEnd: Number(listed) === 2 ? Number(auctionInfo.timeEnd) : 0,
            })
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (nftId && library) {
            getNftInfo();
        }
    }, [nftId, library])

    const listOnSale = async () => { }
    const delistOnSale = async () => {
        try {
            const contract = new Contract(CONTRACT_MARKETPLACE, ABI_MARKETPLACE, library.getSigner());
            const res = await contract.delistToken([nftId]);
            await res.wait();
        } catch (err) {
            console.log(err);
        }
    }
    const buyNft = async () => { }
    const placeBid = async () => {
    }
    return (
        <div className='item-details'>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">NFT Details</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Explore</Link></li>
                                    <li>NFT - { nftId}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <div className="tf-section tf-item-details">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="content-left">
                                <div className="media">
                                    <img src={imgdetail1} alt="Axies" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="content-right">
                                <div className="sc-item-details">
                                    <h2 className="style2">“Puff #{nft.id}” </h2>
                                    {/* <div className="meta-item">
                                        <div className="left">
                                            <span className="viewed eye">225</span>
                                            <span to="/login" className="liked heart wishlist-button mg-l-8"><span className="number-like">100</span></span>
                                        </div>
                                        <div className="right">
                                            <Link to="#" className="share"></Link>
                                            <Link to="#" className="option"></Link>
                                        </div>
                                    </div> */}
                                    <div className="client-infor sc-card-product">
                                        <div className="meta-info">
                                            <div className="author">
                                                {/* <div className="avatar">
                                                    <img src={img6} alt="Axies" />
                                                </div> */}
                                                <div className="info">
                                                    <span>Owned By</span>
                                                    <h6>{nft.currentOwner === '' ? 'Unknown' : shortAddress(nft.currentOwner===CONTRACT_MARKETPLACE?nft.originalOwner: nft.currentOwner)} </h6>                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    <img src={img7} alt="Axies" />
                                                </div>
                                                <div className="info">
                                                    <span>Create By</span>
                                                    <h6> <Link to="/author">Freddie Carpenter</Link> </h6>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                    <p>Habitant sollicitudin faucibus cursus lectus pulvinar dolor non ultrices eget.
                                        Facilisi lobortisal morbi fringilla urna amet sed ipsum vitae ipsum malesuada.
                                        Habitant sollicitudin faucibus cursus lectus pulvinar dolor non ultrices eget.
                                        Facilisi lobortisal morbi fringilla urna amet sed ipsum</p>
                                    {nft.listed === 1 ?
                                        <div className="meta-item-details style2">
                                            <div className="item meta-price">
                                                <span className="heading">Price</span>
                                                <div className="price">
                                                    <div className="price-box">
                                                        <h5> {nft.price} GRAV</h5>
                                                        {/* <span>= ${nft.price * ethPrice}</span> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div> :
                                    nft.listed === 2 ?
                                        <div className="meta-item-details style2">
                                            <div className="item meta-price">
                                                <span className="heading">Current Bid</span>
                                                <div className="price">
                                                    <div className="price-box">
                                                        <h5> {nft.price} ETH</h5>
                                                        {/* <span>= ${nft.price * ethPrice}</span> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="item count-down">
                                                <span className="heading style-2">Countdown</span>
                                                <Countdown date={nft.timeEnd}>
                                                    <span>You are good to go!</span>
                                                </Countdown>
                                            </div>
                                        </div> :
                                        <div className="meta-item-details style2"></div>
                                    }
                                    {nft.listed === 0 ? nft.currentOwner === account ?
                                        <>
                                            <div className="d-flex align-items-center mb-3">
                                                <h5 className="mr-3">List with Auction</h5>
                                                <Switch
                                                    onChange={() => { setIsAuction(!isAuction) }}
                                                    checked={isAuction}
                                                    disabled={false}
                                                    height={24}
                                                    />
                                            </div>
                                            {isAuction ?
                                                <div className="d-flex">
                                                    <div className="w-50 pr-2">
                                                        <input id="price" name="price" className="mb-3" tabIndex="1" aria-required="true" type="text" placeholder="Base Price" required />
                                                    </div>
                                                    <div className="w-50 pl-2">
                                                        <InputMask
                                                            id="duration"
                                                            type="text"
                                                            mask='99/99/99/99' 
                                                            placeholder='DD/HH/MM/SS'
                                                            onChange={(e) => {
                                                                console.log(e.target.value)
                                                            }}
                                                        >
                                                        </InputMask>
                                                    </div>
                                                </div>:
                                                <input id="price" name="price" className="mb-3" tabIndex="1" aria-required="true" type="text" placeholder="Price" required />}
                                            <button className="sc-button loadmore style bag fl-button pri-3 w-100"><span>List on sale</span></button>
                                        </>: null
                                        :
                                        nft.listed === 1 ? nft.originalOwner === account ?
                                            <button className="sc-button loadmore style bag fl-button pri-3 w-100" onClick={delistOnSale}><span>Delist on sale</span></button>
                                            :
                                            <button className="sc-button loadmore style bag fl-button pri-3 w-100" onClick={buyNft}><span>Buy NFT</span></button>
                                        :
                                        nft.originalOwner === account ?
                                            <button className="sc-button loadmore style bag fl-button pri-3 w-100" disabled={nft.timeEnd > Date.now() || nft.highestBid === 0} onClick={delistOnSale}><span>Cancel auction</span></button>
                                            :
                                            <button className="sc-button loadmore style bag fl-button pri-3 w-100" onClick={placeBid}><span>Place a bid</span></button>
                                    }
                                    <div className="flat-tabs themesflat-tabs">
                                    <Tabs>
                                        <TabList>
                                        <Tab>Bid History</Tab>
                                        {/* <Tab>Info</Tab>
                                        <Tab>Provenance</Tab> */}
                                        </TabList>

                                        <TabPanel>
                                            <ul className="bid-history-list">
                                            {
                                                dataHistory.map((item, index) => (
                                                    <li key={index} item={item}>
                                                        <div className="content">
                                                            <div className="client">
                                                                <div className="sc-author-box style-2">
                                                                    <div className="author-avatar">
                                                                        <Link to="#">
                                                                            <img src={item.img} alt="Axies" className="avatar" />
                                                                        </Link>
                                                                        <div className="badge"></div>
                                                                    </div>
                                                                    <div className="author-infor">
                                                                        <div className="name">
                                                                            <h6><Link to="/author">{item.name} </Link></h6> <span> place a bid</span>
                                                                        </div>
                                                                        <span className="time">{item.time}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="price">
                                                                <h5>{item.price}</h5>
                                                                <span>= {item.priceChange}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                            </ul>
                                        </TabPanel>
                                        {/* <TabPanel>
                                            <ul className="bid-history-list">
                                                    <li>
                                                        <div className="content">
                                                            <div className="client">
                                                                <div className="sc-author-box style-2">
                                                                    <div className="author-avatar">
                                                                        <Link to="#">
                                                                            <img src={img1} alt="Axies" className="avatar" />
                                                                        </Link>
                                                                        <div className="badge"></div>
                                                                    </div>
                                                                    <div className="author-infor">
                                                                        <div className="name">
                                                                            <h6> <Link to="/author">Mason Woodward </Link></h6> <span> place a bid</span>
                                                                        </div>
                                                                        <span className="time">8 hours ago</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                            </ul>
                                        </TabPanel>
                                        <TabPanel>
                                            <div className="provenance">
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                                    It has survived not only five centuries, but also the leap into electronic typesetting, 
                                                    remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                                                    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                            </div>
                                        </TabPanel> */}
                                    </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LiveAuction data={liveAuctionData} />
            <Footer />
        </div>
    );
}

export default ItemDetails01;

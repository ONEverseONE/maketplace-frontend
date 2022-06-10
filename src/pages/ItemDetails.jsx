import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import liveAuctionData from "../assets/fake-data/data-live-auction";
import LiveAuction from "../components/layouts/LiveAuction";
import img1 from "../assets/images/avatar/avt-3.jpg";
import img2 from "../assets/images/avatar/avt-11.jpg";
import img3 from "../assets/images/avatar/avt-1.jpg";
import img4 from "../assets/images/avatar/avt-5.jpg";
import img5 from "../assets/images/avatar/avt-7.jpg";
import img6 from "../assets/images/avatar/avt-8.jpg";
import imgdetail1 from "../assets/images/box-item/images-item-details.jpg";
import { useParams } from "react-router";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import {
  CONTRACT_NFT_PUFF,
  CONTRACT_MARKETPLACE,
  CONTRACT_TOKEN,
  PUFF_IMAGE_URL,
  ZERO_ADDRESS,
} from "../constant";
// import { PUFF_RARITY } from "../constant/puff.js";
import { ABI_MARKETPLACE, ABI_NFT_PUFF, ABI_TOKEN } from "../constant/abis.js";
import { setupMultiCallContract, shortAddress } from "../utils";
import { formatEther, parseEther } from "@ethersproject/units";
import Switch from "react-switch";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { GQL_GETALL, GQL_GETLISTED } from "../constant/gqls";
import { useQuery } from "@apollo/client";

const ItemDetails01 = () => {
  const [dataHistory] = useState([
    {
      img: img1,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img2,
      name: "Mason Woodward",
      time: "at 06/10/2021, 3:20 AM",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img3,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img4,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img5,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img6,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
  ]);

  const { nftId } = useParams();
  const { account, library } = useWeb3React();

  const [isAuction, setIsAuction] = useState(false);
  const [fixPrice, setFixPrice] = useState("10");
  const [auctionPrice, setAuctionPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [differentialAmount, setDifferentialAmount] = useState(10);

  const [nft, setNft] = useState({
    id: Number(nftId),
    img: `${PUFF_IMAGE_URL}${nftId}.png`,
    // rarity: PUFF_RARITY[Number(nftId) - 1].nftRarity,
    currentOwner: "",
    listed: 0,
  });

  const {
    loading: listed_loading,
    error: listed_error,
    data: listed_data,
    refetch: listed_refetch,
    fetchMore: listed_fetchMore,
  } = useQuery(GQL_GETLISTED, {
    // variables: { address: account?.toLowerCase() },
    fetchPolicy: "no-cache",
  });

  console.log(listed_loading, listed_data)

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
      console.log(currentOwner, "this is the owner");

      // through graphql
      const [multicallMarketProvider, multicallMarketContract] =
        await setupMultiCallContract(
          CONTRACT_MARKETPLACE,
          ABI_MARKETPLACE,
          library
        );

        console.log("breakpoint 1")

      const [listed, saleInfo, auctionInfo] = await multicallMarketProvider.all(
        [
          multicallMarketContract.listed(CONTRACT_NFT_PUFF, nftId),
          multicallMarketContract.directSales(CONTRACT_NFT_PUFF, nftId),
          multicallMarketContract.auctionSales(CONTRACT_NFT_PUFF, nftId),
        ]
      );

      console.log("breakpoint 2")

      console.log({
        id: Number(nftId),
        img: `${PUFF_IMAGE_URL}${nftId}.png`,
        // rarity: PUFF_RARITY[Number(nftId) - 1].nftRarity,
        currentOwner: currentOwner,
        listed: Number(listed),
        originalOwner:
          Number(listed) === 1 ? saleInfo.owner : auctionInfo.owner,
        price: Number(listed) === 1 ? Number(formatEther(saleInfo.price)) : 0,
        highestBid:
          Number(listed) === 2
            ? Number(formatEther(auctionInfo.highestBid))
            : 0,
        highestBidder:
          Number(listed) === 2 ? auctionInfo.highestBidder : ZERO_ADDRESS,
        timeEnd: Number(listed) === 2 ? Number(auctionInfo.timeEnd) * 1000 : 0,
      });
      console.log(
        Number(auctionInfo.timeEnd) * 1000 < Date.now(),
        nft.timeEnd > 0
      );

      setNft({
        id: Number(nftId),
        img: `${PUFF_IMAGE_URL}${nftId}.png`,
        // rarity: PUFF_RARITY[Number(nftId) - 1].nftRarity,
        currentOwner: currentOwner,
        listed: Number(listed),
        originalOwner:
          Number(listed) === 1 ? saleInfo.owner : auctionInfo.owner,
        price: Number(listed) === 1 ? Number(formatEther(saleInfo.price)) : 0,
        highestBid:
          Number(listed) === 2
            ? Number(formatEther(auctionInfo.highestBid))
            : 0,
        highestBidder:
          Number(listed) === 2 ? auctionInfo.highestBidder : ZERO_ADDRESS,
        timeEnd: Number(listed) === 2 ? Number(auctionInfo.timeEnd) * 1000 : 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getDifferentialAmount = async () => {
    try {
      const contract = new Contract(
        CONTRACT_MARKETPLACE,
        ABI_MARKETPLACE,
        library
      );
      setDifferentialAmount(
        Number(formatEther(await contract.differentialAmount()))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (nftId && library) {
      getNftInfo();
      getDifferentialAmount();
    }
  }, [nftId, library]);

  //   useEffect(() => {
  //       if (typeof listed_data === 'undefined'){
  //           console.log("data not loaded yet")
  //       }
  //       else if (listed_data.length === 0){
  //         console.log("data empty", listed_data)
  //       }
  //       else{
  //           console.log("data here", listed_data)
  //       }
  //   }, [listed_loading])

  const updateDuration = (val) => {
    const arr = val
      .replaceAll("_", "0")
      .split("/")
      .map((x) => Number(x));
    const res = arr[0] * 86400 + arr[1] * 3600 + arr[2] * 60 + arr[3];
    return res;
  };

  const listOnSale = async () => {
    try {
      const nftContract = new Contract(
        CONTRACT_NFT_PUFF,
        ABI_NFT_PUFF,
        library.getSigner()
      );
      const isApproved = await nftContract.isApprovedForAll(
        account,
        CONTRACT_MARKETPLACE
      );

      if (!isApproved) {
        const ress = await nftContract.setApprovalForAll(
          CONTRACT_MARKETPLACE,
          true
        );
        await ress.wait();
      }

      const marketContract = new Contract(
        CONTRACT_MARKETPLACE,
        ABI_MARKETPLACE,
        library.getSigner()
      );
      if (isAuction) {
        if (!(auctionPrice > 0)) {
          toast.error("Price should be higher than 0");
          return;
        }
        const time = updateDuration(duration);
        if (!(time > 0)) {
          toast.error("Duration should be higher than 0");
          return;
        }
        const res = await marketContract[
          "listToken(address,uint256,uint256,uint256)"
        ](CONTRACT_NFT_PUFF, nftId, parseEther(auctionPrice), time); // hard coded rn, get from subgraphs later
        await res.wait();
        toast.success("Success!");
      } else {
        if (!(fixPrice > 0)) {
          toast.error("Price should be higher than 0");
          return;
        }
        const res = await marketContract["listToken(address,uint256,uint256)"](
          CONTRACT_NFT_PUFF,
          nftId,
          parseEther(fixPrice)
        );
        await res.wait();
        toast.success("Success!");
      }
      getNftInfo();
    } catch (err) {
      console.log(err);
      const msg = JSON.parse(JSON.stringify(err));
      toast.error(
        msg.data?.message ?? msg.message ?? "Something went wrong, please retry"
      );
    }
  };
  const delistOnSale = async () => {
    try {
      const contract = new Contract(
        CONTRACT_MARKETPLACE,
        ABI_MARKETPLACE,
        library.getSigner()
      );
      const res = await contract.delistToken([CONTRACT_NFT_PUFF], [nftId]); // 1 TO 1 ARRAY
      await res.wait();
      toast.success("Success!");
      getNftInfo();
    } catch (err) {
      console.log(err);
      const msg = JSON.parse(JSON.stringify(err));
      toast.error(
        msg.data?.message ?? msg.message ?? "Something went wrong, please retry"
      );
    }
  };

  const buyNft = async () => {
    try {
      const contract = new Contract(
        CONTRACT_TOKEN,
        ABI_TOKEN,
        library.getSigner()
      );
      const allowance = await contract.allowance(
        // might need to change later
        account,
        CONTRACT_MARKETPLACE
      );
      const totalSupply = await contract.totalSupply();

      if (!allowance.gt(totalSupply)) {
        const ress = await contract.approve(
          CONTRACT_MARKETPLACE,
          BigNumber.from(2).pow(256).sub(1)
        );
        await ress.wait();
      }

      const marketContract = new Contract(
        CONTRACT_MARKETPLACE,
        ABI_MARKETPLACE,
        library.getSigner()
      );
      console.log(nft.price);
      const res = await marketContract.buyToken(
        CONTRACT_NFT_PUFF,
        nftId,
        parseEther(nft.price.toString())
      );
      await res.wait();
      toast.success("Success!");
      getNftInfo();
    } catch (err) {
      console.log(err);
      const msg = JSON.parse(JSON.stringify(err));
      toast.error(
        msg.data?.message ?? msg.message ?? "Something went wrong, please retry"
      );
    }
  };
  const placeBid = async (bidvalue) => {
    console.log("place bid try");
    console.log("nftID", nftId);
    try {
      const contract = new Contract(
        CONTRACT_TOKEN,
        ABI_TOKEN,
        library.getSigner()
      );
      const allowance = await contract.allowance(account, CONTRACT_MARKETPLACE);
      const totalSupply = await contract.totalSupply();

      if (!allowance.gt(totalSupply)) {
        const ress = await contract.approve(
          CONTRACT_MARKETPLACE,
          BigNumber.from(2).pow(256).sub(1)
        );
        await ress.wait();
      }

      const marketContract = new Contract(
        CONTRACT_MARKETPLACE,
        ABI_MARKETPLACE,
        library.getSigner()
      );

      const auctionsales = await marketContract.auctionSales(
        CONTRACT_NFT_PUFF,
        nftId
      );
      console.log("auction sales here");
      console.log(auctionsales);

      if (bidvalue <= auctionsales.highestBid.toNumber() + differentialAmount) {
        console.log("low bid value");
        console.log(
          "condition failed",
          bidvalue,
          auctionsales.highestBid.toNumber(),
          differentialAmount
        );
        toast.error("bid too low, please retry");
      } else {
        console.log(
          "condition matched",
          bidvalue,
          auctionsales.highestBid.toNumber(),
          differentialAmount
        );
      }

      console.log(
        "testing data",
        CONTRACT_NFT_PUFF,
        nftId,
        parseEther(fixPrice)
      );

      const res = await marketContract.bidToken(
        CONTRACT_NFT_PUFF,
        nftId,
        parseEther(fixPrice)
      );
      await res.wait();
      toast.success("Success!");
      getNftInfo();
    } catch (err) {
      const msg = JSON.parse(JSON.stringify(err));
      toast.error(
        msg.data?.message ?? msg.message ?? "Something went wrong, please retry"
      );
    }
  };

  const endAuction = async () => {
    try {
      const contract = new Contract(
        CONTRACT_MARKETPLACE,
        ABI_MARKETPLACE,
        library.getSigner()
      );
      const res = await contract.retrieveToken(CONTRACT_NFT_PUFF, nftId);
      await res.wait();
      toast.success("Success!");
      getNftInfo();
    } catch (err) {
      console.log(err);
      const msg = JSON.parse(JSON.stringify(err));
      toast.error(
        msg.data?.message ?? msg.message ?? "Something went wrong, please retry"
      );
    }
  };

  // const royaltyRetrieve = () => {

  // }

  // to do

  return (
    <div className="item-details">
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
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/explore">Explore</Link>
                  </li>
                  <li>NFT - {nftId}</li>
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
                          <h6>
                            {nft.currentOwner === ""
                              ? "Unknown"
                              : shortAddress(
                                  nft.currentOwner === CONTRACT_MARKETPLACE
                                    ? nft.originalOwner
                                    : nft.currentOwner
                                )}{" "}
                          </h6>{" "}
                        </div>
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
                  <p>
                    Habitant sollicitudin faucibus cursus lectus pulvinar dolor
                    non ultrices eget. Facilisi lobortisal morbi fringilla urna
                    amet sed ipsum vitae ipsum malesuada. Habitant sollicitudin
                    faucibus cursus lectus pulvinar dolor non ultrices eget.
                    Facilisi lobortisal morbi fringilla urna amet sed ipsum
                  </p>
                  <br />
                  <br />
                  <button
                    className="sc-button loadmore style bag fl-button pri-3 w-100"
                    disabled={
                      nft.highestBidder === account ||
                      (nft.timeEnd < Date.now() && nft.timeEnd > 0)
                    }
                    onClick={placeBid}
                  >
                    <span>
                      {nft.timeEnd < Date.now() && nft.timeEnd > 0
                        ? "Auction is ended"
                        : nft.highestBidder === account
                        ? "You are highest bidder"
                        : "Place a bid"}
                    </span>
                  </button>

                  {nft.listed === 1 ? (
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
                    </div>
                  ) : nft.listed === 2 ? (
                    <div className="meta-item-details style2">
                      <div className="item meta-price">
                        <span className="heading">Minimum Bid</span>
                        <div className="price">
                          <div className="price-box">
                            <h5>
                              {" "}
                              {nft.timeEnd === 0
                                ? nft.highestBid
                                : nft.highestBid + differentialAmount}{" "}
                              ETH
                            </h5>
                            {/* <span>= ${nft.price * ethPrice}</span> */}
                          </div>
                        </div>
                      </div>
                      <div className="item count-down">
                        <span className="heading style-2">Countdown</span>
                        <Countdown date={nft.timeEnd}>
                          <span>
                            {nft.timeEnd === 0
                              ? "No bidder yet"
                              : "You are good to go!"}
                          </span>
                        </Countdown>
                      </div>
                    </div>
                  ) : (
                    <div className="meta-item-details style2"></div>
                  )}
                  {nft.listed === 0 ? (
                    nft.currentOwner === account ? (
                      <>
                        <div className="d-flex align-items-center mb-3">
                          <h5 className="mr-3">List with Auction</h5>
                          <Switch
                            onChange={() => {
                              setIsAuction(!isAuction);
                            }}
                            checked={isAuction}
                            disabled={false}
                            height={24}
                          />
                        </div>
                        {isAuction ? (
                          <div className="d-flex">
                            <div className="w-50 pr-2">
                              <input
                                name="price"
                                className="mb-3"
                                tabIndex="1"
                                aria-required="true"
                                type="text"
                                placeholder="Base Price"
                                value={auctionPrice}
                                onChange={(e) => {
                                  setAuctionPrice(e.target.value);
                                }}
                                required
                              />
                            </div>
                            <div className="w-50 pl-2">
                              <InputMask
                                id="duration"
                                type="text"
                                mask="99/99/99/99"
                                placeholder="DD/HH/MM/SS"
                                onChange={(e) => {
                                  setDuration(e.target.value);
                                }}
                              ></InputMask>
                            </div>
                          </div>
                        ) : (
                          <input
                            name="price"
                            className="mb-3"
                            tabIndex="1"
                            aria-required="true"
                            type="text"
                            placeholder="Price"
                            value={fixPrice}
                            onChange={(e) => {
                              setFixPrice(e.target.value);
                            }}
                            required
                          />
                        )}
                        <button
                          className="sc-button loadmore style bag fl-button pri-3 w-100"
                          onClick={listOnSale}
                        >
                          <span>List on sale</span>
                        </button>
                      </>
                    ) : null
                  ) : nft.listed === 1 ? (
                    nft.originalOwner === account ? (
                      <button
                        className="sc-button loadmore style bag fl-button pri-3 w-100"
                        onClick={delistOnSale}
                      >
                        <span>Delist on sale</span>
                      </button>
                    ) : (
                      <button
                        className="sc-button loadmore style bag fl-button pri-3 w-100"
                        onClick={buyNft}
                      >
                        <span>Buy NFT</span>
                      </button>
                    )
                  ) : nft.timeEnd < Date.now() && nft.timeEnd > 0 ? (
                    <button
                      className="sc-button loadmore style bag fl-button pri-3 w-100"
                      disabled={
                        nft.originalOwner !== account &&
                        nft.highestBidder !== account
                      }
                      onClick={endAuction}
                    >
                      <span>
                        {nft.originalOwner !== account &&
                        nft.highestBidder !== account
                          ? "Auction is ended"
                          : "End auction"}
                      </span>
                    </button>
                  ) : nft.originalOwner === account ? (
                    <button
                      className="sc-button loadmore style bag fl-button pri-3 w-100"
                      disabled={nft.timeEnd > 0}
                      onClick={delistOnSale}
                    >
                      <span>Cancel auction</span>
                    </button>
                  ) : (
                    <>
                      <input
                        name="price"
                        className="mb-4"
                        tabIndex="1"
                        aria-required="true"
                        type="text"
                        placeholder="Bid Amount"
                        value={fixPrice}
                        onChange={(e) => {
                          setFixPrice(e.target.value);
                        }}
                        required
                      />
                      <button
                        className="sc-button loadmore style bag fl-button pri-3 w-100"
                        disabled={
                          nft.highestBidder === account ||
                          (nft.timeEnd < Date.now() && nft.timeEnd > 0)
                        }
                        onClick={placeBid}
                      >
                        <span>
                          {nft.timeEnd < Date.now() && nft.timeEnd > 0
                            ? "Auction is ended"
                            : nft.highestBidder === account
                            ? "You are highest bidder"
                            : "Place a bid"}
                        </span>
                      </button>
                    </>
                  )}
                  <div className="flat-tabs themesflat-tabs">
                    <Tabs>
                      <TabList>
                        <Tab>Bid History</Tab>
                        {/* <Tab>Info</Tab>
                                        <Tab>Provenance</Tab> */}
                      </TabList>

                      <TabPanel>
                        <ul className="bid-history-list">
                          {dataHistory.map((item, index) => (
                            <li key={index} item={item}>
                              <div className="content">
                                <div className="client">
                                  <div className="sc-author-box style-2">
                                    <div className="author-avatar">
                                      <Link to="#">
                                        <img
                                          src={item.img}
                                          alt="Axies"
                                          className="avatar"
                                        />
                                      </Link>
                                      <div className="badge"></div>
                                    </div>
                                    <div className="author-infor">
                                      <div className="name">
                                        <h6>
                                          <Link to="/author">{item.name} </Link>
                                        </h6>{" "}
                                        <span> place a bid</span>
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
                          ))}
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
      {listed_loading ? (
         <LiveAuction data={[]} placebidfunc={placeBid} />
      ) : (
        <LiveAuction data={listed_data.nfts} placebidfunc={placeBid} />
      )}
      <Footer />
    </div>
  );
};

export default ItemDetails01;

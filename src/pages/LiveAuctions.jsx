import React, { useState, useRef } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import liveAuctionData from "../assets/fake-data/data-live-auction";
import LiveAuction from "../components/layouts/auctions/LiveAuction";
import fuzzysort from "fuzzysort";

const LiveAuctions = () => {
  
  const searchParam = useRef()

  const [rawData] = useState(liveAuctionData)
  const [dataBox, setDataBox] = useState(liveAuctionData)

  const fuzzySearch = () => {
    let param = searchParam.current.value
    console.log(param)

    let finalRes = []

    const results = fuzzysort.go(param, rawData, { key: 'title'} )
    for (let i = 0; i < results.length; i++){
      finalRes.push(results[i].obj)
    }

    const authResults = fuzzysort.go(param, rawData, { key: 'nameAuthor'} )
    for (let i = 0; i < authResults.length; i++){
      finalRes.push(authResults[i].obj)
    }

    const colResults = fuzzysort.go(param, rawData, { key: 'nameCollection'} )
    for (let i = 0; i < colResults.length; i++){
      finalRes.push(colResults[i].obj)
    }

    // console.log(results)
    // console.log(authResults)
    console.log(finalRes)

    setDataBox(finalRes)
  }

  return (
    <div className="auctions">
      <Header />
      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Auctions</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  {/* <li><Link to="#">Explore</Link></li> */}
                  <li>Auctions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="inner custom-search">
        <div className="widget widget-search mgbt-24" id="custom-search-div">
          <form action="#">
            <input
              className="style-2"
              type="text"
              placeholder="Enter your word art"
              ref={searchParam}
              required
            />
            <button className="style-2" onClick={fuzzySearch}>
              <i className="icon-fl-search-filled"></i>
            </button>
          </form>
        </div>
      </section>
      <LiveAuction data={dataBox} />
      <Footer />
    </div>
  );
};

export default LiveAuctions;

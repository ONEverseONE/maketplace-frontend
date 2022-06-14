// import { formatEther, parseEther } from "@ethersproject/units";
import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { CONTRACT_MARKETPLACE } from "../../../constant";
import { shortAddress } from "../../../utils";
import CardModal from "../CardModal";

const ExploreItem = (props) => {
  const { data, getMore, isAll, isMine } = props;
  console.log(props);

  const [visible, setVisible] = useState(12);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 12);
  };

  const [modalShow, setModalShow] = useState(false);

  console.log("items here hehehehehe")
  console.log(data)
  return (
    <Fragment>
      <div className="explore">
        <div className="box-epxlore">
          {(isMine ? data.slice(0, visible) : data).map((item, index) => (
            <Link to={`/nft/${item.id}`}>
              <div
                className={`sc-card-product explode style2 mg-bt ${
                  item.listed === 0 ? "comingsoon" : ""
                } `}
                key={index}
              >
                <div className="card-media">
                  <Link to={`/nft/${item.id}`}>
                    <div className="custom-image-container">
                      <img src={item.img} alt="Axies" className="img-custom" />
                    </div>
                  </Link>
                  <div className="button-place-bid">
                    <button
                      onClick={() => setModalShow(true)}
                      className="sc-button style-place-bid style bag fl-button pri-3"
                    >
                      <span>Place Bid</span>
                    </button>
                  </div>
                  <div className="coming-soon">Not Listed</div>
                </div>
                <div className="card-title">
                  <h2>
                    <Link to={`/nft/${item.id}`}>"Puff {item.id}"</Link>
                  </h2>

                  <div className="tags">ONE</div>
                </div>
                <div className="meta-info">
                  <div className="author">
                    <div className="info">
                      <span>Owner</span>
                      <h6>
                        {shortAddress(
                          item.currentOwner === CONTRACT_MARKETPLACE
                            ? item.originalOwner
                            : item.currentOwner
                        )}
                      </h6>
                    </div>
                  </div>

                  <div className="author">
                    {/* <div className="info align-items-end">
                      <span className="w-100 d-flex justify-content-end">
                        Rarity
                      </span>
                      <h6>{item.rarity}</h6>
                    </div> */}
                  </div>
                </div>
                <div className="card-bottom style-explode">
                  <div className="price">
                    <span>
                      Price {item.highestBid > 0 ? "(highest bid)" : ""}
                    </span>
                    <div className="price-details">
                      {item.listed === 0 ? (
                        <h5>Not listed</h5>
                      ) : (
                        <>
                          <h5>
                            {item.highestBid > 0 ? (item.highestBid) : item.price}{" "}
                            <span>ONE</span>
                          </h5>
                          <span>= $ {item.price}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* <Link to="/activity" className="view-history reload">
                  View History
                </Link> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {((isMine && visible < data.length) || (!isAll && !isMine)) && (
          <div className="btn-auction center">
            <Link
              to="#"
              id="load-more"
              className="sc-button loadmore fl-button pri-3"
              onClick={isMine ? showMoreItems : getMore}
            >
              <span>Load More</span>
            </Link>
          </div>
        )}
      </div>
      <CardModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default ExploreItem;

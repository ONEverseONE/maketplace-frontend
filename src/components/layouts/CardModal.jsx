import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

const CardModal = (props) => {
  const [bidValue, setBidvalue] = useState(1);

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-20 pd-40">
        <h3>Place a Bid</h3>
        <p className="text-center">
          You must bid at least{" "}
          <span className="price color-popup">4.89 ETH</span>
        </p>
        <input
          type="text"
          className="form-control"
          placeholder="00.00 ETH"
          value={bidValue}
          onChange={(event) => setBidvalue(event.target.value)}
        />
        {/* <p>
          Enter quantity. <span className="color-popup">5 available</span>
        </p>
        <input type="number" className="form-control" placeholder="1" /> */}
        <div className="hr"></div>
        <div className="d-flex justify-content-between">
          <p> You must bid at least:</p>
          <p className="text-right price color-popup"> 4.89 ETH </p>
        </div>
        <div className="d-flex justify-content-between">
          <p> Service fee:</p>
          <p className="text-right price color-popup"> 0,89 ETH </p>
        </div>
        <div className="d-flex justify-content-between">
          <p> Total bid amount:</p>
          <p className="text-right price color-popup"> 4 ETH </p>
        </div>
        {/* <Link
          to="/wallet-connect"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#popup_bid_success"
          data-dismiss="modal"
          aria-label="Close"
        >
          {" "}
          Place a bid
        </Link> */}
        <button
          onClick={() => props.placebidfunc(bidValue)}
          className="sc-button style-place-bid style bag fl-button pri-3"
        >
          <span>Place Bid</span>
        </button>
      </div>
    </Modal>
  );
};

export default CardModal;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logofooter from "../../assets/images/logo/logotype.png";
const Footer = () => {
  const accountList = [
    {
      title: "Puffs",
      link: "/explore/puffs",
    },
    {
      title: "HarMolecules",
      link: "/explore/harmolecules",
    },
    {
      title: "More...",
      link: "/explore",
    },
  ];
  const resourcesList = [
    // {
    //     title: "Help & Support",
    //     link: "/help-center"
    // },
    {
      title: "Live Auctions",
      link: "/live-auctions",
    },
    // {
    //   title: "Item Details",
    //   link: "/item-details",
    // },
    {
      title: "Activity (coming soon)",
      link: "#",
    },
  ];
  const companyList = [
    // {
    //   title: "Explore",
    //   link: "/explore",
    // },
    {
      title: "Contact Us",
      link: "/contact",
    },
    {
      title: "FAQ",
      link: "/faq",
    },
  ];
  const socialList = [
    {
      icon: "fab fa-twitter",
      link: "https://mobile.twitter.com/oneverseone",
    },
    {
      icon: "icon-fl-vt",
      link: "https://discord.com/invite/ONEverse",
    },
    {
      icon: "fab fa-reddit",
      link: "https://www.reddit.com/r/ONEverse/",
    },
    {
      icon: "fab fa-facebook",
      link: "https://www.facebook.com/ONEverse-101682745753136/",
    },
    {
      icon: "fab fa-telegram-plane",
      link: "https://t.me/ONEverseONEoff",
    },
    {
      icon: "fab fa-instagram",
      link: "https://instagram.com/oneverse.one?igshid=YmMyMTA2M2Y=",
    },
    {
      icon: "fab fa-medium",
      link: "http://ovexclusive.com/",
    },
    {
      icon: "fa fa-link",
      link: "https://linktr.ee/oneverse",
    },
  ];

  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      <footer id="footer" className="footer-light-style clearfix bg-style">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-12">
              <div className="widget widget-logo">
                <div className="logo-footer" id="logo-footer">
                  <Link to="/">
                    <img
                      className="logo-dark"
                      id="logo_footer"
                      src={logofooter}
                      width="245px"
                      alt="nft-gaming"
                    />
                    <img
                      className="logo-light"
                      id="logo_footer"
                      src={logofooter}
                      width="245px"
                      alt="nft-gaming"
                    />
                  </Link>
                </div>
                <p className="sub-widget-logo">
                  Lorem ipsum dolor sit amet,consectetur adipisicing elit. Quis
                  non, fugit totam vel laboriosam vitae.
                </p>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-5 col-5">
              <div className="widget widget-menu style-1">
                <h5 className="title-widget">Explore Collections</h5>
                <ul>
                  {accountList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-7 col-7">
              <div className="widget widget-menu style-2">
                <h5 className="title-widget">Marketplace</h5>
                <ul>
                  {resourcesList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-5 col-5">
              <div className="widget widget-menu fl-st-3">
                <h5 className="title-widget">OneVerse</h5>
                <ul>
                  {companyList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-7 col-12">
              <div className="widget widget-subcribe">
                <h5 className="title-widget">Our Socials</h5>
                {/* <div className="form-subcribe">
                                    <form id="subscribe-form" action="#" method="GET" acceptCharset="utf-8" className="form-submit">
                                        <input name="email"  className="email" type="email" placeholder="info@yourgmail.com" required />
                                        <button id="submit" name="submit" type="submit"><i className="icon-fl-send"></i></button>
                                    </form>
                                </div> */}
                <div className="widget-social style-1 mg-t32">
                  <ul>
                    {socialList.map((item, index) => (
                      <li key={index}>
                        <a href={item.link} target="_blank">
                          <i className={item.icon}></i>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {isVisible && <Link onClick={scrollToTop} to="#" id="scroll-top"></Link>}

      <div
        className="modal fade popup"
        id="popup_bid"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
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
              />
              <p>
                Enter quantity. <span className="color-popup">5 available</span>
              </p>
              <input type="number" className="form-control" placeholder="1" />
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
              <Link
                to="#"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#popup_bid_success"
                data-dismiss="modal"
                aria-label="Close"
              >
                {" "}
                Place a bid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

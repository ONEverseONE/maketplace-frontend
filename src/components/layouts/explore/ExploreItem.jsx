import React , { useState , Fragment } from 'react';
import { Link } from 'react-router-dom'
import { CONTRACT_MARKETPLACE } from '../../../constant';
import { shortAddress } from '../../../utils';
import CardModal from '../CardModal';

const ExploreItem = props => {
    const {data, getMore} = props

    // const [visible , setVisible] = useState(6);
    // const showMoreItems = () => {
    //     setVisible((prevValue) => prevValue + 6);
    // }

    const [modalShow, setModalShow] = useState(false);
    return (
        <Fragment>
            <div className='explore'>
                <div className="box-epxlore">
                    {
                        data.map((item,index) => (
                            <div className={`sc-card-product explode style2 mg-bt ${item.listed === 0 ? 'comingsoon' : '' } `} key={index}>
                            <div className="card-media">
                                <Link to={`/nft/${item.id}`}><img src={item.img} alt="Axies" /></Link>
                                <div className="button-place-bid">
                                    <button onClick={() => setModalShow(true)} className="sc-button style-place-bid style bag fl-button pri-3"><span>Place Bid</span></button>
                                </div>
                                <div className="coming-soon">Not Listed</div>
                            </div>
                            <div className="card-title">
                                    <h2><Link to={`/nft/${item.id}`}>"Puff {item.id}"</Link></h2>
                                    
                                    <div className="tags">ONE</div>
                            </div>
                            <div className="meta-info">
                                <div className="author">
                                    <div className="info">
                                        <span>Owner</span>
                                        <h6>{shortAddress(item.currentOwner === CONTRACT_MARKETPLACE ? item.originalOwner : item.currentOwner)}</h6>
                                    </div>
                                </div>
                                    
                                <div className="author">
                                    <div className="info align-items-end">
                                        <span className="w-100 d-flex justify-content-end">Rarity</span>
                                        <h6>{item.rarity}</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="card-bottom style-explode">
                                <div className="price">
                                    <span>Price {item.highestBid > 0 ? '(highest bid)' : ''}</span>
                                        <div className="price-details">
                                            {item.price === 0 ? <h5>Not listed</h5> :
                                                <>
                                                    <h5>{item.highestBid > 0 ? item.highestBid : item.price} <span>ONE</span></h5>
                                                    <span>= $ {item.price}</span>
                                                </>
                                            }
                                    </div>
                                </div>
                                <Link to="/activity" className="view-history reload">View History</Link>
                            </div>
                        </div>
                        ))
                    }
                </div>
                {
                    // visible < data.length && 
                    <div className="btn-auction center"> 
                        <Link to="#" id="load-more" className="sc-button loadmore fl-button pri-3" onClick={getMore}><span>Load More</span></Link>
                    </div>
                }
            </div>
            <CardModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Fragment>
    );
}

export default ExploreItem;

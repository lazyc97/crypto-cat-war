import React from 'react';
import Ethers from 'ethers';

import { IMAGES, CAT_ELEMENTS } from './assets';
import { getFullCatData, getCatIcon } from './utils';

class Marketplace extends React.Component {
  constructor(props) {
    super(props);

    this.auctionCatInputBox = React.createRef();
    this.bidInputBox = React.createRef();

    this.state = {
      auctionInfo: null,
    };

    this.buyInitCat = async (isMale, element) => {
      if (!confirm('Pay 0.1 ETH to buy this cat?')) return;

      if (window.MainContract == null) {
        alert('Please login first!');
        return;
      }

      try {
        await MainContract.buyInitCat(isMale, element, {
          value: Ethers.utils.bigNumberify('1' + ''.padEnd(17, '0')),
        });
        alert('Bought it!');
      } catch (err) {
        console.error(err);
      }
    };

    this.selectAuctionCat = async () => {
      try {
        const id = Ethers.utils.bigNumberify(this.auctionCatInputBox.current.value);
        const info = await getFullCatData(id);
        if (!info.onAuction) throw 'Cat not on auction';

        this.setState({ auctionInfo: info });
        this.bidInputBox.current.value = Ethers.utils.formatUnits(info.highestBid, 'finny');
      } catch (err) {
        console.error(err);
      }
    };

    this.raiseBid = async () => {
      try {
        const amount = Ethers.utils.parseUnits(this.bidInputBox.current.value, 'finny');
        await MainContract.raiseBid(this.state.auctionInfo.id, {
          value: amount,
        });
        this.setState({ auctionInfo: await getFullCatData(this.state.auctionInfo.id) });
      } catch (err) {
        console.error(err);
      }
    };
  }

  render() {
    const { auctionInfo } = this.state;

    return (
      <React.Fragment>
        <section className="fdb-block">
          <div className="container">
            <div className="row text-center justify-content-center">
              <div className="col-8">
                <h1>Init Cats</h1>
                <h3>Initial Cats for new players.</h3>
              </div>
            </div>

            <div className="row-50"></div>

            <div className="row text-center justify-content-center">
              <div className="col-sm-3 m-sm-auto">
                <img alt="image" className="img-fluid" src={IMAGES.femaleCatIcons[0]} onClick={() => this.buyInitCat(false, 0)}></img>

                <h2>Female</h2>
                <p>0.1 ETH</p>
              </div>

              <div className="col-sm-3 m-sm-auto">
                <img alt="image" className="img-fluid" src={IMAGES.fireCatIcons[0]} onClick={() => this.buyInitCat(true, 0)}></img>

                <h2>Male - Fire</h2>
                <p>0.1 ETH</p>
              </div>

              <div className="col-sm-3 m-sm-auto">
                <img alt="image" className="img-fluid" src={IMAGES.waterCatIcons[0]} onClick={() => this.buyInitCat(true, 1)}></img>

                <h2>Male - Water</h2>
                <p>0.1 ETH</p>
              </div>
              <div className="col-sm-3 m-sm-auto">
                <img alt="image" className="img-fluid" src={IMAGES.windCatIcons[0]} onClick={() => this.buyInitCat(true, 2)}></img>

                <h2>Male - Wind</h2>
                <p>0.1 ETH</p>
              </div>
            </div>
          </div>
        </section>
        <section className="fdb-block">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 m-md-auto ml-lg-0 col-lg-5">
                {auctionInfo ? (
                  <React.Fragment>
                    <img alt="image" className="img-fluid" src={getCatIcon(auctionInfo)}></img>
                    <span>
                      <p/>
                      <p>Level: <strong>{auctionInfo.level}</strong> / <strong>{auctionInfo.levelCap}</strong></p>
                      {auctionInfo.level < auctionInfo.levelCap ? (
                        <p>Exp: <strong>{auctionInfo.exp.toString()}</strong> / <strong>{1 << auctionInfo.level}</strong></p>
                      ): (
                        <p>Exp: <strong>Maxed</strong></p>
                      )}
                      {auctionInfo.isMale ? (
                        <React.Fragment>
                          <p>Element: <strong>{CAT_ELEMENTS[auctionInfo.element]}</strong></p>
                          <p>Atk: <strong>{auctionInfo.atk}</strong> - Lv Up: <strong>+{auctionInfo.atkPerLv}</strong></p>
                          <p>Def: <strong>{auctionInfo.def}</strong> - Lv Up: <strong>+{auctionInfo.defPerLv}</strong></p>
                          <p>Hp: <strong>{auctionInfo.hp}</strong> - Lv Up: <strong>+{auctionInfo.hpPerLv}</strong></p>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <p>Breed Fee: <strong>{Ethers.utils.formatEther(auctionInfo.breedFee)} ETH</strong></p>
                        </React.Fragment>
                      )}
                    </span>
                    <p>Highest Bid: <strong>{Ethers.utils.formatEther(auctionInfo.highestBid)} ETH</strong></p>
                    <p>Highest Bidder: <strong>{auctionInfo.highestBidder}</strong></p>
                  </React.Fragment>
                ) : null}
              </div>
              <div className="col-12 col-md-10 col-lg-6 mt-4 mt-lg-0 ml-auto mr-auto ml-lg-auto text-left">
                <div className="row">
                  <div className="col">
                    <h1>Auction</h1>
                    <p className="text-h3">Select cat to bid for.</p>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <div className="input-group">
                      <input ref={this.auctionCatInputBox} type="text" className="form-control" placeholder="Cat's ID"></input>
                      <span className="input-group-btn">
                        <button className="btn" type="button" onClick={this.selectAuctionCat}>Select</button>
                      </span>
                    </div>
                  </div>
                </div>
                {auctionInfo ? (
                  <div className="row mt-2">
                    <div className="col">
                      <div className="input-group">
                        <input ref={this.bidInputBox} type="text" className="form-control"></input>
                        <span className="input-group-btn">
                          <button className="btn" type="button" onClick={this.raiseBid}>Bid (Finney)</button>
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
};

export default Marketplace;
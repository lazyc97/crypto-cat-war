import React from 'react';
import { Link } from 'react-router-dom';

import { images } from './assets';

export default (props) => (
  <React.Fragment>
    <section className="fdb-block">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 mb-4 mb-md-0">
            <img alt="image" className="img-fluid" src={images.welcomeImage} />
          </div>
          <div className="col-12 col-md-6 col-lg-5 ml-md-auto text-left">
            <h1>Crypto Cat War</h1>
            <p className="text-h3">Welcome to a game where you spend Ethereum on useless digital cats.</p>
            <p><Link className="btn btn-round mt-4" to="/profile">Join</Link></p>
          </div>
        </div>
      </div>
    </section>
    <section className="fdb-block">
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <h1>Features</h1>
          </div>
        </div>
        <div className="row text-left mt-5">
          <div className="col-12 col-md-4">
            <div className="row">
              <div className="col-3">
                <img alt="image" className="img-fluid" src={images.auctionIcon} />
              </div>
              <div className="col-9">
                <h3><strong>Auction</strong></h3>
                <p>Bid powerful cats with your Ethereum.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
            <div className="row">
              <div className="col-3">
                <img alt="image" className="img-fluid" src={images.loveIcon} />
              </div>
              <div className="col-9">
                <h3><strong>Breed</strong></h3>
                <p>Get kitties by breeding male and female cats.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
            <div className="row">
              <div className="col-3">
                <img alt="image" className="img-fluid" src={images.battleIcon} />
              </div>
              <div className="col-9">
                <h3><strong>Battle</strong></h3>
                <p>Let's the war of cats begin.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row text-left pt-3 pt-sm-4 pt-md-5">
          <div className="col-12 col-md-4">
            <div className="row">
              <div className="col-3">
                <img alt="image" className="img-fluid" src={images.shoppingIcon} />
              </div>
              <div className="col-9">
                <h3><strong>Buy EXP</strong></h3>
                <p>Pay to win method for rich people.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
            <div className="row">
              <div className="col-3">
                <img alt="image" className="img-fluid" src={images.coinsIcon} />
              </div>
              <div className="col-9">
                <h3><strong>Marketplace</strong></h3>
                <p>Earn Ethereum by putting your cats on auction or let others pay to breed with your female cat.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
            <div className="row">
              <div className="col-3">
                <img alt="image" className="img-fluid" src={images.ethereumIcon} />
              </div>
              <div className="col-9">
                <h3><strong>Ethereum Platform</strong></h3>
                <p>Built on modern decentralized blockchain platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </React.Fragment>
);
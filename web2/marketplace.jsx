import React from 'react';
import Ethers from 'ethers';

import { IMAGES } from './assets';

class Marketplace extends React.Component {
  constructor(props) {
    super(props);

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
  }

  render() {
    return (
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
    );
  }
};

export default Marketplace;
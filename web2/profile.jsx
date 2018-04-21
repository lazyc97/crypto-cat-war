import React from 'react';
import Ethers from 'ethers';

import { images } from './assets';
import { setupContract } from './utils';

class CatInfoCard extends React.Component {
  render() {
    return (
      <div className="col-sm-3 text-left">
        <div className="fdb-box">
          <img alt="image" className="img-fluid" src={images.femaleCatIcons[0]}></img>

          <div className="content">
            <h3><strong>ID: 0</strong></h3>
            <p>Level: 1 / 10</p>
          </div>
        </div>
      </div>
    );
  }
}

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ethAddress: '0x0000000000000000000000000000000000000000',
      ethBalance: 0,
      elements: []
    }

    for (let i = 0; i < 5; ++i) {
      if (i % 4 == 0) this.state.elements.push(<div className="row-50" key={`space${i}`} />);
      this.state.elements.push(<CatInfoCard key={`info${i}`} />);
    }

    this.privateKeyBox = React.createRef();
    this.login = () => {
      let key = this.privateKeyBox.current.value;
      if (key.substr(0, 2) !== '0x') key = '0x' + key;

      const wallet = new Ethers.Wallet(key);
      setupContract(wallet);
      this.setAccount(wallet.address);
    };
    this.generate = () => {
      alert('This game is for people with ETH not newbies, give it up ;)');
    };

    this.setAccount = async (address) => {
      try {
        const balance = await window.MainContract.provider.getBalance(address);
        this.setState({
          ethAddress: address,
          ethBalance: Ethers.utils.formatEther(balance)
        });
      } catch (err) {
        console.error(err);
      }
    };
  }

  componentDidMount() {
    if (window.MainContract) {
      this.setAccount(window.MainContract.signer.address);
    }
  }

  render() {
    return (
      <React.Fragment>
        <section className="fdb-block">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6 text-center">
                <h1>Authenticate</h1>
                <div className="input-group mt-4 mb-4">
                  <input ref={this.privateKeyBox} type="text" className="form-control" placeholder="Enter your private key"></input>
                  <span className="input-group-btn">
                    <button className="btn" type="button" onClick={this.login}>Login</button>
                    <button className="btn" type="button" onClick={this.generate}>Generate</button>
                  </span>
                </div>
                <p className="text-h4">
                  Ethereum Address: {this.state.ethAddress}
                </p>
                <p className="text-h4">Balance: {this.state.ethBalance.toString()} ETH</p>
              </div>
            </div>
          </div>
        </section>
        <section className="fdb-block team-1">
          <div className="container">
            <div className="row text-center justify-content-center">
              <div className="col-8">
                <h1>Owned Cats</h1>
              </div>
            </div>

            <div className="row">
              { this.state.elements }
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Profile;
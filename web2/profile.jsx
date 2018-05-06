import React from 'react';
import Ethers from 'ethers';

import { IMAGES, CAT_ELEMENTS } from './assets';
import { setupContract, setCatPropsByLevel } from './utils';

class CatInfoCard extends React.Component {
  constructor(props) {
    super(props);

    const getCatIcon = () => {
      const grade = Math.floor((this.props.info.level - 1) / 10);
      if (!this.props.info.isMale) return IMAGES.femaleCatIcons[grade];
      switch (this.props.info.element) {
        case 0: return IMAGES.fireCatIcons[grade];
        case 1: return IMAGES.waterCatIcons[grade];
        case 2: return IMAGES.windCatIcons[grade];
        default: return '';
      }
    }
    this.catIcon = getCatIcon();

    this.feedCat = async () => {
      try {
        const num = Ethers.utils.bigNumberify(prompt('How much EXP do you want to buy? (1000 wei = 1 EXP)', '0'));
        await MainContract.feedCat(this.props.info.id, {
          value: num.mul(1000),
        });
        this.props.parent.reloadInfo(this);
      } catch (err) {
        console.error(err);
      }
    };

    this.setBreedFee = async () => {
      try {
        const scale = Ethers.utils.bigNumberify('1' + '0'.repeat(15));
        const num = Ethers.utils.bigNumberify(prompt('Cost for breeding? (finney)', this.props.info.breedFee.div(scale).toString()));
        await MainContract.setBreedFee(this.props.info.id, num.mul(scale));
        this.props.parent.reloadInfo(this);
      } catch (err) {
        console.error(err);
      }
    };
  }

  render() {
    const info = setCatPropsByLevel(this.props.info);

    return (
      <div className="col-sm-3 text-left">
        <div className="fdb-box">
          <img alt="image" className="img-fluid" src={this.catIcon}></img>

          <div className="content">
            <h3><strong>ID: {info.id.toString()}</strong></h3>
            <hr/>
            <p>Level: <strong>{info.level}</strong> / <strong>{info.levelCap}</strong></p>
            {info.level < info.levelCap ? (
              <p>Exp: <strong>{info.exp.toString()}</strong> / <strong>{1 << info.level}</strong></p>
            ): (
              <p>Exp: <strong>Maxed</strong></p>
            )}
            {info.isMale ? (
              <React.Fragment>
                <p>Element: <strong>{CAT_ELEMENTS[info.element]}</strong></p>
                <p>Atk: <strong>{info.atk}</strong> - Lv Up: <strong>+{info.atkPerLv}</strong></p>
                <p>Def: <strong>{info.def}</strong> - Lv Up: <strong>+{info.defPerLv}</strong></p>
                <p>Hp: <strong>{info.hp}</strong> - Lv Up: <strong>+{info.hpPerLv}</strong></p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>Breed Fee: <strong>{Ethers.utils.formatEther(info.breedFee)} ETH</strong></p>
              </React.Fragment>
            )}
            <button className="btn" type="button" onClick={this.feedCat}>Feed</button>
            {this.props.info.isMale ? '' : (
              <React.Fragment>
                <p> </p>
                <button className="btn" type="button" onClick={this.setBreedFee}>Set Fee</button>
              </React.Fragment>
            )}
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

    this.privateKeyBox = React.createRef();
    this.login = () => {
      let key = this.privateKeyBox.current.value;
      if (key.substr(0, 2) !== '0x') key = '0x' + key;

      const wallet = new Ethers.Wallet(key);
      setupContract(wallet);
      this.setAccount(wallet.address);
      this.getOwnedCats();
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

    this.getOwnedCats = async () => {
      try {
        const ownedIds = await MainContract.getOwnedCats();
        const promises = [];
        for (let id of ownedIds) {
          promises.push(MainContract.cats(id));
        }

        const catInfos = await Promise.all(promises);
        promises.length = 0;
        for (let info of catInfos) {
          const f = info.isMale ? MainContract.maleCatInfo : MainContract.femaleCatInfo;
          promises.push(f(info.id));
        }

        const specificInfos = await Promise.all(promises);
        for (let i = 0; i < catInfos.length; ++i) {
          catInfos[i] = Object.assign(catInfos[i], specificInfos[i]);
        }

        const elements = [];
        for (let i = 0; i < catInfos.length; ++i) {
          if (i % 4 == 0) elements.push(<div className="row-50" key={`space${i}`} />);
          elements.push(<CatInfoCard key={`info${i}`} idx={i} info={catInfos[i]} parent={this} />);
        }
        this.setState({ elements: elements });
      } catch (err) {
        console.error(err);
      }
    };

    this.reloadInfo = async (comp) => {
      const oldInfo = comp.props.info;
      const f = oldInfo.isMale ? MainContract.maleCatInfo : MainContract.femaleCatInfo;
      const infos = await Promise.all([MainContract.cats(oldInfo.id), f(oldInfo.id)]);
      const info = Object.assign(...infos);

      const elements = this.state.elements;
      const idx = elements.findIndex((val) => val.props.idx === comp.props.idx);
      elements[idx] = <CatInfoCard key={`info${comp.props.idx}`} idx={comp.props.idx} info={info} parent={this} />;
      this.setState({ elements: elements });
    };
  }

  componentDidMount() {
    if (window.MainContract) {
      this.setAccount(window.MainContract.signer.address);
      this.getOwnedCats();
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
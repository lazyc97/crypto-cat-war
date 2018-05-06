import React from 'react';
import Ethers from 'ethers';

import { IMAGES, CAT_ELEMENTS } from './assets';
import { getFullCatData } from './utils';

class Arena extends React.Component {
  constructor(props) {
    super(props);

    this.DEFAULT_INFO = {
      atk: 0,
      def: 0,
      hp: 0,
      level: 0,
      element: -1,
    };

    this.ownCatInputBox = React.createRef();
    this.atkCatInputBox = React.createRef();

    this.getInfo1 = async () => {
      try {
        const id = Ethers.utils.bigNumberify(this.ownCatInputBox.current.value);
        const info = await getFullCatData(id);
        if (!info.isMale) throw 'Cat is not male';
        if (info.owner !== MainContract.signer.address) throw 'This should be your cat';
        this.setState({
          info1: info,
        });
      } catch (err) {
        console.error(err);
      }
    };
    this.getInfo2 = async () => {
      try {
        const id = Ethers.utils.bigNumberify(this.atkCatInputBox.current.value);
        const info = await getFullCatData(id);
        if (!info.isMale) throw 'Cat is not male';
        if (info.owner === MainContract.signer.address) throw 'This should NOT be your cat';
        this.setState({
          info2: info,
        });
      } catch (err) {
        console.error(err);
      }
    };

    this.attack = async () => {
      const { info1, info2 } = this.state;
      if (info1.level > 0 && info2.level > 0) {
        try {
          await MainContract.attackCat(info1.id, info2.id);
          const newInfo = await MainContract.cats(info1.id);
          alert('Battle finished!');

          this.setState({
            info1: setCatPropsByLevel(Object.assign(info1, newInfo)),
            info2: this.DEFAULT_INFO,
          });
          this.atkCatInputBox.current.value = '';
        } catch (err) {
          console.error(err);
        }
      } else {
        alert('Please select cats first.');
      }
    };

    this.state = {
      info1: this.DEFAULT_INFO,
      info2: this.DEFAULT_INFO,
    };
  }

  render() {
    const { info1, info2 } = this.state;

    return (
      <section className="fdb-block">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 m-md-auto ml-lg-0 col-lg-5">
              <span>
                <p>Owner: <strong>{info1.owner}</strong></p>
                <p>Element: <strong>{CAT_ELEMENTS[info1.element]}</strong></p>
                <p>Level: <strong>{info1.level}</strong></p>
                <p>Atk: <strong>{info1.atk}</strong></p>
                <p>Def: <strong>{info1.def}</strong></p>
                <p>Hp: <strong>{info1.hp}</strong></p>
              </span>
              <p className="display-4">VS</p>
              <span>
                <p>Owner: <strong>{info2.owner}</strong></p>
                <p>Element: <strong>{CAT_ELEMENTS[info2.element]}</strong></p>
                <p>Level: <strong>{info2.level}</strong></p>
                <p>Atk: <strong>{info2.atk}</strong></p>
                <p>Def: <strong>{info2.def}</strong></p>
                <p>Hp: <strong>{info2.hp}</strong></p>
              </span>
            </div>
            <div className="col-12 col-md-10 col-lg-6 mt-4 mt-lg-0 ml-auto mr-auto ml-lg-auto text-left">
              <div className="row">
                <div className="col">
                  <h1>Attack</h1>
                  <p className="text-h3">Input the ID of your cat and the cat you want to attack.</p>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col">
                  <div className="input-group">
                    <input ref={this.ownCatInputBox} type="text" className="form-control" placeholder="Your cat's ID"></input>
                    <span className="input-group-btn">
                      <button className="btn" type="button" onClick={this.getInfo1}>Select</button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col">
                  <div className="input-group">
                    <input ref={this.atkCatInputBox} type="text" className="form-control" placeholder="Attacked cat's ID"></input>
                    <span className="input-group-btn">
                      <button className="btn" type="button" onClick={this.getInfo2}>Select</button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <span className="input-group-btn">
                    <button className="btn" type="button" onClick={this.attack}>Attack</button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default Arena;
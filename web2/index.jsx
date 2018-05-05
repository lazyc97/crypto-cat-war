import 'babel-polyfill';

window.$ = require('jquery');
require('bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Ethers from 'ethers';

import { DEFAULT_ETHERS_PROVIDER } from './assets';
import { setupContract } from './utils';

import NavBar from './nav-bar';
import Footer from './footer';
import Home from './home';
import Profile from './profile';
import Marketplace from './marketplace';
import Arena from './arena';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'froala-design-blocks/dist/css/froala_blocks.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		const key = localStorage.getItem('privateKey');
		if (key) {
			setupContract(new Ethers.Wallet(key));
		}
	}

	render() {
		return (
			<React.Fragment>
				<NavBar />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/home" component={Home} />
					<Route exact path="/profile" component={Profile} />
					<Route exact path="/marketplace" component={Marketplace} />
					<Route exact path="/arena" component={Arena} />
				</Switch>
				<Footer />
			</React.Fragment>
		);
	}
};

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('app')
);
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import { DEFAULT_ETHERS_PROVIDER } from './assets';
import { setupContract } from './utils';

import NavBar from './nav-bar';
import Footer from './footer';
import Home from './home';
import Profile from './profile';

import 'froala-design-blocks/dist/css/froala_blocks.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		const wallet = JSON.parse(localStorage.getItem('wallet'));
		if (wallet) {
			setupContract(wallet);
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
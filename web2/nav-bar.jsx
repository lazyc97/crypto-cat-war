import React from 'react';
import { NavLink } from 'react-router-dom';

export default () => (
	<header className="bg-dark">
		<div className="container">
			<nav className="navbar navbar-expand-md">
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav-bar" aria-controls="main-nav-bar" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="main-nav-bar">
					<ul className="navbar-nav mr-auto ml-auto">
						<li className="nav-item">
							<NavLink className="nav-link" activeClassName="active" to="/home">Home</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" activeClassName="active" to="/profile">Profile</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" activeClassName="active" to="/marketplace">Marketplace</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" activeClassName="active" to="/arena">Arena</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	</header>
);
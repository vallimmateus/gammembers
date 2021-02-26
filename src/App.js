import React, { Component } from "react";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";

import fire from "./config/fire";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null,
		};

		this.authListener = this.authListener.bind(this);
	}

	componentDidMount() {
		this.authListener();
	}

	authListener() {
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({ user });
			} else {
				this.setState({ user: null });
			}
		});
	}

	render() {
		return <div>{this.state.user ? <Home /> : <LoginPage />}</div>;
	}
}

export default App;

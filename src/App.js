import React, { Component } from "react";
import LoginPage from "./pages/Login";
// import Home from "./pages/Home";
import Feedback from "./pages/Feedback360";

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
		return (
			<div
				style={{
					width: "100vw",
					height: "100vh",
				}}
			>
				{this.state.user ? <Feedback /> : <LoginPage />}
			</div>
		);
	}
}

export default App;

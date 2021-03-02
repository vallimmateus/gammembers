import React from "react";
import "./style.css";
import Logout from "../../components/Logout";

function Home() {
	return (
		<>
			<header>
				<div className="user"></div>
				<div className="metas">
					<div className="meta"></div>
				</div>
			</header>
			<div>
				<h1>You're logged in!</h1>
				<Logout />
			</div>
		</>
	);
}

export default Home;

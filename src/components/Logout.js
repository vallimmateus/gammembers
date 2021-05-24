import React from "react";
import fire from "../config/fire";

function Logout() {
	function logout() {
		fire.auth().signOut();
	}

	return (
		<button
			className="neumorphic"
			onClick={logout}
			style={{ maxWidth: "100px" }}
		>
			Logout
		</button>
	);
}

export default Logout;

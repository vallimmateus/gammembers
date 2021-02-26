import React from "react";
import fire from "../config/fire";

function Logout() {
	function logout() {
		fire.auth().signOut();
	}

	return <button onClick={logout}>Logout</button>;
}

export default Logout;

import React from "react";
import "./style.css";
import Perfil from "../../images/Fotos.png";
import Login from "../../components/Login";

function LoginPage() {
	return (
		<div className="Container">
			<div className="InContainer">
				<img src={Perfil} className="Perfil" alt="perfil" />
				<Login />
			</div>
		</div>
	);
}

export default LoginPage;

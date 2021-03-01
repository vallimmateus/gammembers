import React, { useState } from "react";
import "./style.css";
import Perfil from "../../images/Fotos.png";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";
import { Button } from "@material-ui/core";
import { getMemberByEmail } from "../../config/fire";

function LoginPage() {
	const [comp, setComp] = useState("Login");

	let miniPage;
	if (comp === "Login") {
		miniPage = (
			<div>
				<Login />
				<Button
					variant="outlined"
					onClick={() => {
						setComp("Sign Up");
					}}
				>
					Sign Up
				</Button>
			</div>
		);
	} else if (comp === "Sign Up") {
		miniPage = (
			<div>
				<SignUp />
				<Button
					variant="outlined"
					onClick={() => {
						setComp("Login");
					}}
				>
					Voltar
				</Button>
				<Button
					onClick={() => {
						getMemberByEmail(
							document.querySelector("#email").value
						);
					}}
				>
					Teste
				</Button>
			</div>
		);
	}
	return (
		<div className="Container">
			<div className="InContainer">
				<img src={Perfil} className="Perfil" alt="perfil" />
				{miniPage}
			</div>
		</div>
	);
}

export default LoginPage;

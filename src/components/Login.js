import React from "react";
import fire from "../config/fire";
import { TextField, Button } from "@material-ui/core";

function Login() {
	function login() {
		const email = document.querySelector("#email").value;
		const password = document.querySelector("#password").value;

		fire.auth()
			.signInWithEmailAndPassword(email, password)
			.catch((err) => {
				alert(err.toString());
			});
	}

	return (
		<form>
			<TextField
				id="email"
				label="Enter USP"
				type="email"
				required
				fullWidth
			/>
			<TextField
				id="password"
				label="Senha"
				type="password"
				required
				fullWidth
			/>
			<Button className="esqueceu">Esqueceu sua senha?</Button>
			<Button className="login" variant="outlined" onClick={login}>
				Login
			</Button>
		</form>
	);
}

export default Login;

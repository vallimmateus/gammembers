import React from "react";
import fire from "../config/fire";
import { TextField, Button } from "@material-ui/core";

function SignUp() {
	function signUp() {
		const email = document.querySelector("#email").value;
		if (email.endsWith("@usp.br")) {
			const password = document.querySelector("#password").value;

			fire.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((u) => {
					alert("Successfully Signed up");
				})
				.catch((err) => {
					alert(err.toString());
				});
		}
	}

	return (
		<form>
			<TextField
				id="email"
				label="Email USP"
				type="email"
				required
				fullWidth
			/>
			<TextField
				id="nome"
				label="Nome completo"
				type="text"
				required
				fullWidth
			/>
			<TextField
				id="nUSP"
				label="Número USP"
				type="number"
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
			<TextField
				id="password"
				label="Confirme a senha"
				type="password"
				required
				fullWidth
			/>
			<Button variant="outlined" onClick={signUp}>
				Sign Up
			</Button>
		</form>
	);
}

export default SignUp;

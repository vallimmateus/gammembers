import React from "react";
// import fire from "../config/fire";
import { TextField, Button } from "@material-ui/core";
import { members } from "../config/fire";

function SignUp() {
	function signUp() {
		const email = document.querySelector("#email").value;
		if (email.endsWith("@usp.br")) {
			console.log(
				"0: ",
				members
					.where("emailUsp", "==", email)
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							return doc.data().nome;
						});
					})
			);

			// const password = document.querySelector("#password").value;

			// fire.auth()
			// 	.createUserWithEmailAndPassword(email, password)
			// 	.then((u) => {
			// 		alert("Successfully Signed up");
			// 	})
			// 	.catch((err) => {
			// 		alert(err.toString());
			// 	});
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
				id="password2"
				label="Confirme a senha"
				type="password"
				required
				fullWidth
			/>
			<Button className="login" variant="outlined" onClick={signUp}>
				Sign Up
			</Button>
		</form>
	);
}

export default SignUp;

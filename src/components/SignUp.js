import React from "react";
import fire from "../config/fire";
// import firebase from "firebase";
import { TextField, Button } from "@material-ui/core";
import { members } from "../config/fire";

function SignUp() {
	function changeEmail() {
		const email = document.querySelector("#email").value;
		if (email.endsWith("@usp.br")) {
			members
				.where("emailUsp", "==", email)
				.get()
				.then(async (querySnapshot) => {
					let promisses = querySnapshot.docs.map((doc) => {
						return doc.data();
					});
					const exportArray = await Promise.all(promisses);
					document.querySelector("input#nome").value =
						exportArray[0].nome;
					document.querySelector("input#nUsp").value =
						exportArray[0].nUsp;
					document
						.querySelector("#nome-label")
						.classList.add(
							"MuiInputLabel-shrink",
							"MuiFormLabel-filled"
						);
					document
						.querySelector("#nUsp-label")
						.classList.add(
							"MuiInputLabel-shrink",
							"MuiFormLabel-filled"
						);
				});
		}
	}

	function signUp() {
		const email = document.querySelector("#email").value;
		const nome = document.querySelector("#nome").value;
		const nUsp = document.querySelector("#nUsp").value;
		const password = document.querySelector("#password").value;
		const password2 = document.querySelector("#password2").value;

		if (email.endsWith("@usp.br") && password === password2) {
			if (!email || !nome || !nUsp || !password || !password2) {
				alert("Error: Field empty!");
			} else if (password !== password2) {
				alert("Error: The passwords are different!");
			} else {
				fire.auth()
					.createUserWithEmailAndPassword(email, password)
					.then((u) => {
						members
							.where("emailUsp", "==", email)
							.get()
							.then(async (querySnapshot) => {
								let promises = querySnapshot.docs.map((doc) => {
									return doc.data();
								});
								const exportArray = await Promise.all(promises);
								u.user.updateProfile({
									displayName: exportArray[0].apelido,
								});
								alert(
									"Successfully Signed up, ",
									exportArray[0].apelido
								);
							});
					})
					.catch((err) => {
						alert(err.toString());
					});
			}
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
				onChange={changeEmail}
			/>
			<TextField
				id="nome"
				label="Nome completo"
				type="text"
				required
				fullWidth
			/>
			<TextField
				id="nUsp"
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

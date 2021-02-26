import React from "react";
import fire from "../config/fire";

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

	function signUp() {
		const email = document.querySelector("#email").value;
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

	return (
		<div>
			<div>
				Email USP
				<input id="email" placeholder="Enter email..." type="email" />
			</div>
			<div>
				Senha
				<input
					id="password"
					placeholder="Enter password..."
					type="password"
				/>
			</div>
			<label>
				<button className="Button" onClick={login}>
					Login
				</button>
			</label>
			<label>
				<button className="Button" onClick={signUp}>
					Sign Up
				</button>
			</label>
			<label>
				<input type="checkbox" />
				Mantenha-me conectado
			</label>
		</div>
	);
}

export default Login;

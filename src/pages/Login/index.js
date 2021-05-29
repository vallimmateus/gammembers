import React, { useState } from "react";
import "./style.css";
import Perfil from "../../images/Fotos.png";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";
import { Button, makeStyles, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	root: {
		"&": {
			overflow: "visible",
		},
		"& form, & > div": {
			display: "flex",
			alignItems: "center",
			flexDirection: "column",
			height: "100%",
			overflow: "visible",
		},
		"& form > div": {
			height: "100%",
			width: "100%",
			overflowY: "auto",
		},
		"& form > div::-webkit-scrollbar": {
			width: "8px",
		},
		"& form > div::-webkit-scrollbar-track": {
			backgroundColor: "transparent",
			borderRadius: "4px",
		},
		"& form > div:hover::-webkit-scrollbar-track": {
			backgroundColor: "#1c1c1c",
		},
		"& form > div::-webkit-scrollbar-thumb": {
			backgroundColor: "#272727",
			borderRadius: "4px",
		},
		"& form > div:hover::-webkit-scrollbar-thumb": {
			backgroundColor: "#2a2a2a",
		},
		"& form > div > div": {
			marginTop: "15px",
		},
		"& label": {
			marginLeft: "20px",
		},
		"& label.MuiInputLabel-shrink": {
			textTransform: "uppercase",
			transform: "scale(0.8)",
		},
		"& label.Mui-focused": {
			fontWeight: "bold",
		},
		"& button, & #login": {
			width: "40%",
			minWidth: "250px",
			marginTop: "20px",
			textTransform: "uppercase",
			fontSize: "29px",
			fontWeight: "bold",
			borderRadius: "16px",
			border: "unset",
			boxShadow:
				"-4px -4px 10px 3px #fff, 4px 4px 10px -3px rgba(0, 0, 0, 0.25)",
			backgroundColor:
				"linear-gradient(135deg, #d5d5d5 0%, #e0e0e0 100%)",
			minHeight: "50px",
		},
		"& form button": {
			marginTop: "0",
		},
		"& button.login > span:nth-of-type(1)": {
			// "-webkit-background-clip": "text",
			color: "#f5f5f5",
		},
		"& button.login": {
			background: "linear-gradient(135deg, #04A0B6 0%, #1FDDBD 79.17%)",
		},
		"& button.signUp > span:nth-of-type(1)": {
			"-webkit-background-clip": "text",
			color: "transparent",
			background: "linear-gradient(135deg, #212121 0%, #2E2E2E 79.17%)",
		},
		"& button.esqueceu": {
			marginTop: "3px",
			alignSelf: "flex-end",
			width: "auto",
			minWidth: "unset",
			fontSize: "0.8em",
			fontWeight: "unset",
			color: "#0000008a",
			textTransform: "unset",
			boxShadow: "unset",
		},
		"& button.esqueceu.MuiButton-root:hover": {
			backgroundColor: "unset",
			color: "#212121",
		},
		"& button.back": {
			position: "absolute",
			top: "20px",
			left: "20px",
			width: "auto",
			minWidth: "unset",
			marginTop: "unset",
			fontSize: "unset",
			boxShadow: "unset",
			borderRadius: "50%",
		},
		"& .signUp form button": { marginTop: "57px" },
	},
}));

function LoginPage() {
	const [comp, setComp] = useState("Login");
	const classes = useStyles();

	let miniPage;
	if (comp === "Login") {
		miniPage = (
			<div className="login">
				<Login />
				<Button
					className="signUp neumorph"
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
			<div className="signUp">
				<SignUp />
				<IconButton
					className="back"
					onClick={() => {
						setComp("Login");
					}}
				>
					<ArrowBack fontSize="default" />
				</IconButton>
			</div>
		);
	}
	return (
		<div className="Container">
			<div className="InContainer">
				<img src={Perfil} className="Perfil" alt="perfil" />
				<div className={classes.root}>{miniPage}</div>
			</div>
		</div>
	);
}

export default LoginPage;

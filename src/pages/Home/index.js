import React from "react";
import "./style.css";
import Perfil from "../../images/Fotos.png";
import { ReactComponent as BackMetas } from "../../images/BackgroundMetas.svg";
import Logout from "../../components/Logout";
import firebase from "firebase";
import { Icon } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
const myAtiv = require("./my-ativ.json");

function Home() {
	var user = firebase.auth().currentUser;

	function myAtivList() {
		return myAtiv.map((ativ, index) => {
			let id = index + 1;
			return (
				<li
					key={id}
					className={`li${id}`}
					onClick={() => {
						var listMyAtiv = document.querySelectorAll(
							"div.my-ativ ul li"
						);
						var clickMyAtiv = document.querySelector(`.li${id}`)
							.classList;
						if (clickMyAtiv.contains("active")) {
							clickMyAtiv.remove("active");
						} else {
							for (let i = 0; i < listMyAtiv.length; i++) {
								listMyAtiv[i].classList.remove("active");
							}
							clickMyAtiv.add("active");
						}
					}}
				>
					<div className="miniheader">
						<h2 className="nome">{ativ.nome}</h2>
						<p className="area">{ativ.area}</p>
						<p className="prazo">{ativ.prazo}</p>
						<Icon className="openIcon">
							<ArrowBackIos />
						</Icon>
					</div>
					<div className="content">
						<p>{ativ.conteudo}</p>
					</div>
				</li>
			);
		});
	}

	if (user) {
		return (
			<div className="parent">
				<header className="containerHome">
					<div className="user">
						<img src={Perfil} className="Perfil" alt="perfil" />
						<div>
							<p>Bom dia,</p>
							<p>{user.displayName}</p>
						</div>
					</div>
					<BackMetas />
					<div className="metas">
						<div className="meta">
							<h1>Faturamento</h1>
							<p>R$16.264,00</p>
							<p>77,4%</p>
							<div className="chart">
								<div></div>
							</div>
							<p>R$21.000,00</p>
						</div>
						<div className="meta">
							<h1>Número de</h1>
							<h1>Projetos</h1>
							<p>9</p>
							<p>90%</p>
							<div className="chart">
								<div></div>
							</div>
							<p>10</p>
						</div>
						<div className="meta">
							<h1>Membros que</h1>
							<h1>executam</h1>
							<p>81%</p>
							<p>108%</p>
							<div className="chart">
								<div></div>
							</div>
							<p>75%</p>
						</div>
					</div>
				</header>
				<div className="containerHome">
					<Logout />
					<div className="neumorphic my-ativ">
						<h1>Minhas atividades</h1>
						<ul>{myAtivList()}</ul>
					</div>
					<div className="neumorphic jornal">
						<h1>Jornal</h1>
					</div>
					<div className="neumorphic meets">
						<h1>Minhas reuniões</h1>
					</div>
				</div>
			</div>
		);
	} else {
		return;
	}
}

export default Home;

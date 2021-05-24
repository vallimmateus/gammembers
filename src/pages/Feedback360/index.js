import React, { useEffect, useState } from "react";
import "./style.css";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Perfil from "../../images/Fotos.png";
import Logout from "../../components/Logout";
import ProgressBar from "../../components/ProgressBar";
import firebase from "firebase";
import Dots from "./Dots";
import { members, db } from "../../config/fire";
import { GoogleSpreadsheet } from "google-spreadsheet";
import feedjson from "../../config/feedback-360-292622-9ca5e084fa4e.json";

function List() {
	const [list, setList] = useState([]);
	useEffect(() => {
		var username = firebase.auth().currentUser.displayName;
		let listArr = [];
		members
			.where("apelido", "==", username)
			.get()
			.then((doc) => {
				const id = doc.docs[0].id;
				db.collection("members/" + id + "/teams")
					.get()
					.then((col) => {
						col.docs.forEach((doc) => {
							listArr.push(doc.data());
						});
						setList(listArr);
					});
			})
			.catch((error) => {
				alert(error);
			});
	}, []);
	return list;
}

function Top() {
	const list = List();
	return list.map((e) => {
		var i;
		var dots = [];
		for (i = 0; i < e.respondidos; i++) {
			dots.push(<Dots active />);
		}
		for (i = 0; i < e.total - e.respondidos; i++) {
			dots.push(<Dots />);
		}
		return (
			<tr style={{ overflow: "visible" }} key={Math.random()}>
				<td>
					<p>{e.team}</p>
				</td>
				<td style={{ overflow: "visible" }}>{dots}</td>
			</tr>
		);
	});
}

function Teams(setIndex) {
	const list = List();
	if (list.length > 0) {
		return list.map((e) => {
			return (
				<li
					onClick={() => {
						changeList(list.indexOf(e));
						setIndex(list.indexOf(e));
					}}
					id={list.indexOf(e)}
					className={list.indexOf(e) === 0 ? "active" : ""}
				>
					{e.team}
				</li>
			);
		});
	}
}

function Table(index = 0) {
	const [isLoading, setLoading] = useState(true);
	const [linksExt, setLinksExt] = useState([]);
	const list = List();
	const totalPromise = TotalList();
	totalPromise.then((total) => {
		const { unique, links } = total;

		// console.log("Table()", links);
		if (links !== undefined) {
			if (links.length > 0 && linksExt.length === 0) {
				// console.log("lá dentro", links);
				setLoading(false);
				setLinksExt(links);
				// console.log("chegou aqui");
			}
		}
	});

	if (isLoading) {
		return (
			<tr>
				<td colSpan="4">Carregando...</td>
			</tr>
		);
	}
	// console.log(linksExt);

	if (list.length > 0 && linksExt.length > 0) {
		// console.log("links", localLinks);
		var pessoas = list.map((e) => {
			return Object.entries(e.pessoas);
		});
		if (pessoas.length > 0) {
			// pessoas[index].map(async (e) => {
			// 	const idx = linksExt.findIndex((element) => {
			// 		return element.nome === e[0];
			// 	});
			// 	var pessoa = linksExt[idx];
			// 	if (pessoa.respondido === null) {
			// 		const promise = verifyNumUsp(pessoa.sheet);
			// 		const resp = await promise.then((prom) => {
			// 			return prom;
			// 		});
			// 		console.log(pessoa.nome, resp);
			// 		var copyLinksExt = linksExt;
			// 		copyLinksExt[idx].respondido = resp;
			// 		setLinksExt(copyLinksExt);
			// 	}
			// });
			return pessoas[index].map((e) => {
				return (
					<tr
						// className={true ? "" : "inactive"}
						key={pessoas[index].indexOf(e)}
					>
						<td>{e[0]}</td>
						<td>{e[1][0]}</td>
						<td>
							{e[1][1].toDate().getDate()}/
							{parseInt(e[1][1].toDate().getMonth()) + 1} -{" "}
							{e[1][2].toDate().getDate()}/
							{parseInt(e[1][2].toDate().getMonth()) + 1}
						</td>
						<td>
							<a
								onClick={async () => {
									const idx = linksExt.findIndex(
										(element) => {
											return element.nome === e[0];
										}
									);
									var pessoa = linksExt[idx];
									const promise = verifyNumUsp(pessoa.sheet);
									const resp = await promise.then((prom) => {
										return prom;
									});
									if (resp) {
										alert(
											"Você já respondeu este feedback"
										);
									} else {
										window.open(pessoa.form, "_blank");
									}
								}}
								// href={
								// 	linksExt.find(
								// 		(element) => element.nome === e[0]
								// 	).form
								// }
								// target="_blank"
								rel="noopener noreferrer"
							>
								Responder
							</a>
						</td>
					</tr>
				);
			});
		}
	}
}

function Dias() {
	const now = new Date();
	const finish = new Date(2021, 5, 7, 23, 59, 59, 999);
	const diffTime = Math.abs(finish - now);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

async function TotalList() {
	const list = List();
	const query = [];
	list.map((e) => {
		return Object.entries(e.pessoas).map((pessoa) => {
			return query.push(pessoa[0]);
		});
	});
	const unique = [...new Set(query)];
	const collectionLinks = await db.collection("links").get();
	let promises = collectionLinks.docs.map((doc) => {
		return doc.data();
	});
	const arr = await Promise.all(promises);
	let links = [];
	// console.log("unique", unique);
	unique.map((eUnique) => {
		const e = arr.find((element) => element.nome === eUnique);
		var sheet = e.sheet;
		var sheetId = sheet.slice(sheet.lastIndexOf("/") + 1, sheet.length);
		return links.push({
			nome: e.nome,
			form: e.form,
			sheet: sheetId,
			respondido: null,
		});
	});
	// const promises = unique.map(async (e) => {
	// 	const doc = await db.collection("links").doc(e).get();
	// 	var sheet = doc.data().sheet;
	// 	var sheetId = sheet.slice(sheet.lastIndexOf("/") + 1, sheet.length);
	// 	var resp = verifyNumUsp(sheetId);
	// 	links.push({
	// 		nome: e,
	// 		form: doc.data().form,
	// 		sheet: sheetId,
	// 		respondido: resp,
	// 	});
	// });
	if (unique.length === links.length) {
		// console.log("TotalList()", links);
		return { unique, links, list };
	}
}

function Feedback() {
	const [index, setIndex] = useState(0);
	const [unq, setUnq] = useState(1);
	const { width } = useWindowDimensions();
	const totalPromise = TotalList();
	totalPromise.then((total) => {
		const { unique } = total;
		setUnq(unique.length);
	});
	console.log("unq:", unq);
	const dias = Dias();
	var user = firebase.auth().currentUser;
	var username = user.displayName;
	const [done, setDone] = useState(0);
	useEffect(() => {
		members
			.where("apelido", "==", username)
			.get()
			.then(async (querySnapshot) => {
				let promises = querySnapshot.docs.map((doc) => {
					return doc.data();
				});
				const exportData = await Promise.all(promises);
				setDone(exportData[0].concluido);
			})
			.catch((error) => {
				alert(error);
			});
	}, [username]);

	if (user) {
		return (
			<div
				className="parent"
				style={{
					backgroundColor: "#212121",
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
				}}
			>
				<header>
					<div className="user">
						<img src={Perfil} className="Perfil" alt="perfil" />
						<div>
							<p>Bom dia, {user.displayName}</p>
						</div>
					</div>
					<Logout />
				</header>
				<div className="container">
					<div>
						<div className="top">
							<div
								className="neumorphic"
								style={{
									display: "inline-flex",
									flex: "1",
								}}
							>
								<ProgressBar
									percentage={done}
									size={width * 0.083}
									stroke={width * 0.016}
								/>
								<div
									className="feedback"
									style={{
										fontSize: "18px",
										overflow: "visible",
									}}
								>
									<h2>Feedback 360</h2>
									<div
										style={{
											overflowY: "auto",
											height: "100%",
										}}
									>
										<table
											style={{
												overflow: "visible",
											}}
										>
											{Top()}
										</table>
									</div>
								</div>
							</div>
							<div
								className="neumorphic"
								style={{
									display: "flex",
									flexDirection: "row",
									maxWidth: "450px",
								}}
							>
								<div className="days">
									<defs>
										<linearGradient
											id="linear"
											x1="0%"
											y1="50%"
											x2="100%"
											y2="100%"
										>
											<stop
												offset="0%"
												stopColor="#04A0B6"
											/>
											<stop
												offset="80%"
												stopColor="#1fddbd"
											/>
										</linearGradient>
									</defs>
									<svg
										viewBox="0 0 100 100"
										width={`${width * 0.083}px`}
									>
										<rect
											fill="url(#linear)"
											width="100"
											height="100"
											rx="15"
										/>
									</svg>
									<div>
										<p>faltam</p>
										<div>
											<p>{dias}</p>
										</div>
										<p>dias</p>
									</div>
								</div>
								<div
									style={{
										height: "100%",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
									}}
								>
									<p style={{ fontWeight: "bold" }}>Dica:</p>
									<p
										style={{
											margin: "15px 10px",
											maxWidth: "210px",
											textAlign: "center",
										}}
									>
										<span style={{ verticalAlign: "top" }}>
											Responda
										</span>
										<span
											className="text-neumorphic"
											style={{ fontSize: "60px" }}
										>
											{Math.ceil(unq / dias)}
										</span>
										formulário
										{Math.ceil(unq / dias) > 1 ? "s" : ""}
										<br />a cada dia
									</p>
								</div>
							</div>
						</div>
						<div
							className="teams"
							style={{
								overflow: "unset",
								flex: "1",
								display: "flex",
								flexDirection: "row",
								marginLeft: "8px",
								filter: "drop-shadow( -4px -4px 5px rgba(248, 248, 248, 0.08)) drop-shadow(4px 4px 5px rgba(0, 0, 0, 0.75))",
							}}
						>
							<div
								className="teams-list"
								style={{
									position: "relative",
									display: "flex",
									overflowY: "auto",
									margin: "35px 0",
									width: "154px",
								}}
							>
								<svg
									width="154"
									height="121"
									viewBox="0 0 154 121"
									style={{
										display: "flex",
										marginRight: "-24px",
										position: "absolute",
									}}
								>
									<path
										d="M 0 40 C 0 28.9543 8.9543 20 20 20 H 120 C 125.523 20 130 15.5228 130 10 V 0 H 153 V 121 H 130 V 111 C 130 105.477 125.523 101 120 101 H 20 C 8.9543 101 0 92.0457 0 81 Z"
										fill="#212121"
									/>
								</svg>
								<ul
									style={{
										position: "absolute",
										margin: "0",
										marginTop: "20px",
										padding: "0",
										textAlign: "center",
										width: "130px",
										listStyleType: "none",
									}}
								>
									{Teams(setIndex)}
								</ul>
							</div>
							<div
								className="neumorphic list"
								style={{
									flex: "1",
									marginLeft: "0",
									zIndex: "2",
									backgroundColor: "#212121",
									boxShadow: "unset",
								}}
							>
								<div>
									<table>
										<tr>
											<th>Nome</th>
											<th colSpan="2">Trabalhou em</th>
											<th>Feedback 360</th>
										</tr>
										{Table(index)}
									</table>
								</div>
							</div>
						</div>
					</div>
					<div
						className="neumorphic sidebar"
						style={{ maxWidth: "20vw" }}
					>
						<h2>Dúvidas Sobre como responder o Feedback 360?</h2>
						<h3>Eu preciso responder de todo mundo?</h3>
						<p>
							Você irá responder apenas daqueles que você trabalha
							atualmente (ex: diretórios, núcleos, projetos,
							departamentos)
						</p>
						<h3>
							Não tenho uma opinião formatada sobre fulano, e
							agora?
						</h3>
						<p>
							Escreva com base no que você trabalhou com a pessoa
							e seja o mais sincero possível, caso ache que está
							muito simples coloque uma observação “não tenho uma
							opinião formada sobre”
						</p>
						<h3>Por que eu preciso responder de tantas pessoas?</h3>
						<p>
							Com o seu feedback você está dando a oportunidade da
							outra pessoa poder evoluir mais ainda, e assim fazer
							com que a empresa Gamma Jr cresça ainda mais.
						</p>
						<h2>Ficou com mais alguma dúvida?</h2>
						<p>
							Entre em contato com algum membro de GP para que
							possa te orientar melhor. Não fique com vergonha de
							perguntas idiotas, toda dúvida é válida e pode ser a
							dúvida de outra pessoa também.
						</p>
					</div>
				</div>
			</div>
		);
	} else {
		return;
	}
}

export default Feedback;

function changeList(i) {
	const svg = document.querySelector("div.teams svg");
	svg.style.top = i * 81 + "px";
	const list = document.querySelector("div.teams ul");
	list.childNodes.forEach((e) => {
		e.classList = "";
	});
	list.childNodes[i].classList += "active";
}

// Config variables
// const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
// const SHEET_ID = process.env.REACT_APP_SHEET_ID;
// const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
// const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

// docId = "1lPyBA_05fAWC2KYUzBuvuog1UCCDlyqZr378y3FDEEs",
async function verifyNumUsp(docId, start = 2, end = 50) {
	const doc = new GoogleSpreadsheet(docId);

	try {
		await doc.useServiceAccountAuth({
			client_email: feedjson.client_email,
			private_key: feedjson.private_key,
		});
		await doc.loadInfo();

		const sheet = doc.sheetsByIndex[0];
		let arr = [];
		await sheet.loadCells(`B${start}:B${end}`);
		for (let i = start; i <= end; i++) {
			const value = sheet.getCellByA1(`B${i}`).value;
			if (value != null) {
				arr.push(value);
			}
		}
		var numUsp = await Promise.resolve(NUsp());
		return arr.includes(numUsp);
	} catch (e) {
		console.log("Error: ", e);
	}
}

async function NUsp() {
	var username = firebase.auth().currentUser.displayName;
	var numUsp;
	numUsp = await members
		.where("apelido", "==", username)
		.get()
		.then((doc) => {
			return doc.docs[0].data().nUsp;
		})
		.catch((error) => {
			alert(error);
		});
	return numUsp;
}

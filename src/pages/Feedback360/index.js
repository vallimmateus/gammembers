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

function Top({ list = [] }) {
	if (list.length > 0) {
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
	} else {
		return (
			<tr
				style={{
					height: "70%",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<p>Carregando...</p>
			</tr>
		);
	}
}

function Teams({ setIndex = () => {}, list = [] }) {
	if (list.length > 0) {
		return list.map((e) => {
			return (
				<li
					onClick={() => {
						changeList(list.indexOf(e));
						setIndex(list.indexOf(e));
					}}
					key={list.indexOf(e)}
					className={list.indexOf(e) === 0 ? "active" : ""}
				>
					{e.team}
				</li>
			);
		});
	} else {
		return <li className="active">Carregando times</li>;
	}
}

function Table({ index = 0, links = {}, list = [] }) {
	const [isLoading, setLoading] = useState(true);
	const [linksExt, setLinksExt] = useState([]);
	if (links !== undefined && links.length > 0 && linksExt.length === 0) {
		setLoading(false);
		setLinksExt(links);
	}
	if (isLoading) {
		return (
			<tr>
				<td colSpan="4">Carregando...</td>
			</tr>
		);
	} else {
		var pessoas = list.map((e) => {
			return Object.entries(e.pessoas);
		});
		if (pessoas.length > 0) {
			return pessoas[index].map((e) => {
				return (
					<tr
						// className={true ? "" : "inactive"}
						key={pessoas[index].indexOf(e)}
					>
						<td>{e[0]}</td>
						<td>{e[1][0]}</td>
						<td>
							{e[1][1]
								? `${e[1][1].toDate().getDate()}/
							${parseInt(e[1][1].toDate().getMonth()) + 1} -${" "}
							${e[1][2].toDate().getDate()}/
							${parseInt(e[1][2].toDate().getMonth()) + 1}`
								: "sem dados"}
						</td>
						<td>
							<div
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
								rel="noopener noreferrer"
							>
								Responder
							</div>
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

function TotalList(list = []) {
	const [verify, setVerify] = useState(true);
	const [arr, setArr] = useState({});
	const query = [];
	list.map((e) => {
		return Object.entries(e.pessoas).map((pessoa) => {
			return query.push(pessoa[0]);
		});
	});
	const unique = [...new Set(query)];
	useEffect(() => {
		db.collection("links")
			.get()
			.then(async (querySnapshot) => {
				let promises = querySnapshot.docs.map((doc) => {
					return doc.data();
				});
				const exportData = await Promise.all(promises);
				setArr(exportData);
			})
			.catch((error) => {
				alert(error);
			});
	}, []);

	let links = [];
	if (unique.length !== links.length && verify) {
		setVerify(false);
	}
	unique.map((eUnique) => {
		const e = arr.find((element) => element.nome === eUnique);
		var sheet = e.sheet;
		var sheetId = sheet.slice(sheet.lastIndexOf("/") + 1, sheet.length);
		// setTimeout(() => {
		// 	var resp = verifyNumUsp(sheetId);
		// 	console.log(e.nome, ": ", resp);
		// }, 250);
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
		return { unique, links };
	}
}

function Feedback() {
	const [index, setIndex] = useState(0);
	const list = List();
	const { width } = useWindowDimensions();
	const { unique, links } = TotalList(list);
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
								<div className="feedback">
									<h2>Feedback 360</h2>
									<div
										style={{
											overflow: "auto",
											height: "100%",
										}}
									>
										<table
											style={{
												overflow: "visible",
												height: "calc(100% - 4px)",
												width: "100%",
											}}
										>
											<Top list={list} />
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
									<div
										style={{
											height: "calc(100% - 6px)",
											padding: "3px",
											borderRadius: "30px",
											backgroundColor: "#212121",
											boxShadow:
												"-3px -3px 7.5px rgba(248, 248, 248, 0.08), 3px 3px 7.5px rgba(0, 0, 0, 0.75)",
										}}
									>
										<div
											style={{
												height: "100%",
												borderRadius: "27px",
												overflow: "hidden",
												position: "relative",
											}}
										>
											<div
												style={{
													height: "100%",
													width: "100%",
													borderRadius: "27px",
													position: "absolute",
													boxShadow:
														"inset -3px -3px 7.5px rgba(248, 248, 248, 0.08), inset 3px 3px 7.5px rgba(0, 0, 0, 0.75)",
												}}
											></div>
											<defs>
												<linearGradient
													id="linear"
													x1="0%"
													y1="100%"
													x2="100%"
													y2="100%"
												>
													<stop
														offset="0%"
														// stopColor="#04A0B6"
														color="#04A0B6"
													/>
													<stop
														offset="80%"
														// stopColor="#1fddbd"
														color="#1fddbd"
													/>
												</linearGradient>
											</defs>
											<svg
												viewBox="0 0 100 100"
												height="100%"
											>
												<rect
													fill="url(#linear)"
													width="100"
													height="100"
												/>
											</svg>
										</div>
									</div>
									<div>
										<p>faltam</p>
										<div>
											<p>{dias}</p>
										</div>
										<p>dias</p>
									</div>
								</div>
								<div>
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
											{Math.ceil(unique.length / dias)}
										</span>
										formulário
										{Math.ceil(unique.length / dias) > 1
											? "s"
											: ""}
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
									<Teams setIndex={setIndex} list={list} />
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
										<Table
											index={index}
											links={links}
											list={list}
										/>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div
						className="neumorphic sidebar"
						style={{ maxWidth: "20vw" }}
					>
						<div>
							<h2>
								Dúvidas Sobre como responder o Feedback 360?
							</h2>
							<h3>Eu preciso responder de todo mundo?</h3>
							<p>
								Você irá responder apenas daqueles que você
								trabalha atualmente (ex: diretórios, núcleos,
								projetos, departamentos)
							</p>
							<h3>
								Não tenho uma opinião formatada sobre fulano, e
								agora?
							</h3>
							<p>
								Escreva com base no que você trabalhou com a
								pessoa e seja o mais sincero possível, caso ache
								que está muito simples coloque uma observação
								“não tenho uma opinião formada sobre”
							</p>
							<h3>
								Por que eu preciso responder de tantas pessoas?
							</h3>
							<p>
								Com o seu feedback você está dando a
								oportunidade da outra pessoa poder evoluir mais
								ainda, e assim fazer com que a empresa Gamma Jr
								cresça ainda mais.
							</p>
							<h2>Ficou com mais alguma dúvida?</h2>
							<p>
								Entre em contato com algum membro de GP para que
								possa te orientar melhor. Não fique com vergonha
								de perguntas idiotas, toda dúvida é válida e
								pode ser a dúvida de outra pessoa também.
							</p>
						</div>
					</div>
				</div>
			</div>
		);
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

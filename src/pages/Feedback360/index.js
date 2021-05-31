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
import { SettingsOutlined } from "@material-ui/icons";

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

// function Table() {
// 	if (stage === 0) {
// 		return (
// 			<tr>
// 				<td colSpan="4">Carregando...</td>
// 			</tr>
// 		);
// 	} else if (stage === 1) {
// 		return (
// 			<>
// 				<tr>
// 					<td colSpan="4">Carregando...</td>
// 				</tr>
// 				<tr>
// 					<td>Psiu</td>
// 				</tr>
// 			</>
// 		);
// 	} else if (stage === 2) {
// 		return (
// 			<>
// 				<tr>
// 					<td colSpan="4">Carregando...</td>
// 				</tr>
// 				<tr>
// 					<td>Psiu</td>
// 					<td colSpan="2">É, você mesmo!</td>
// 					<td>Vem aqui</td>
// 				</tr>
// 			</>
// 		);
// 	} else if (stage === 3) {
// 		return (
// 			<>
// 				<tr>
// 					<td colSpan="4">Carregando...</td>
// 				</tr>
// 				<tr>
// 					<td>Psiu</td>
// 					<td colSpan="2">É, você mesmo!</td>
// 					<td>Vem aqui</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="4">
// 						Sabia que faltam 3 dias pro feedback acabar?
// 					</td>
// 				</tr>
// 			</>
// 		);
// 	} else if (stage === 4) {
// 		return (
// 			<>
// 				<tr>
// 					<td colSpan="4">Carregando...</td>
// 				</tr>
// 				<tr>
// 					<td>Psiu</td>
// 					<td colSpan="2">É, você mesmo!</td>
// 					<td>Vem aqui</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="4">
// 						Sabia que faltam 3 dias pro feedback acabar?
// 					</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="3">
// 						Mas fica tranquilo, se você clicar aqui eu consigo te
// 						arranjar mais alguns dias pra responder
// 					</td>
// 					<td>
// 						<div>WikiGamma</div>
// 					</td>
// 				</tr>
// 			</>
// 		);
// 	} else if (stage === 5) {
// 		return (
// 			<>
// 				<tr>
// 					<td colSpan="4">Carregando...</td>
// 				</tr>
// 				<tr>
// 					<td>Psiu</td>
// 					<td colSpan="2">É, você mesmo!</td>
// 					<td>Vem aqui</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="4">
// 						Sabia que faltam 3 dias pro feedback acabar?
// 					</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="3">
// 						Mas fica tranquilo, se você clicar aqui eu consigo te
// 						arranjar mais alguns dias pra responder
// 					</td>
// 					<td>
// 						<div>WikiGamma</div>
// 					</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="3">Clica vai, ninguém tá olhando</td>
// 				</tr>
// 			</>
// 		);
// 	} else {
// 		return (
// 			<>
// 				<tr>
// 					<td colSpan="4">Carregando...</td>
// 				</tr>
// 				<tr>
// 					<td>Psiu</td>
// 					<td colSpan="2">É, você mesmo!</td>
// 					<td>Vem aqui</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="4">
// 						Sabia que faltam 3 dias pro feedback acabar?
// 					</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="3">
// 						Mas fica tranquilo, se você clicar aqui eu consigo te
// 						arranjar mais alguns dias pra responder
// 					</td>
// 					<td>
// 						<div>WikiGamma</div>
// 					</td>
// 				</tr>
// 				<tr>
// 					<td colSpan="3">Clica vai, ninguém tá olhando</td>
// 					<td>É rapidinho</td>
// 				</tr>
// 			</>
// 		);
// 	}
// }

function Dias() {
	const now = new Date();
	const finish = new Date(2021, 5, 7, 23, 59, 59, 999);
	const diffTime = Math.abs(finish - now);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

function TotalList(list, numUsp) {
	const [verify, setVerify] = useState(false);
	const [arr, setArr] = useState({});
	const [resp, setResp] = useState([]);
	const [myId, setMyId] = useState("");
	var username = firebase.auth().currentUser.displayName;
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
	useEffect(() => {
		if (list !== undefined && arr !== {}) {
			setVerify(true);
		}
		members
			.where("apelido", "==", username)
			.get()
			.then((doc) => {
				const id = doc.docs[0].id;
				setMyId(id);
				const collec = db
					.collection("members")
					.doc(id)
					.collection("unique");
				collec
					.get()
					.then(async (sub) => {
						if (sub.docs.length > 0) {
							// console.log(
							// 	"já existe a subcoleção unique no firebase:",
							// 	sub.docs[0].data().A
							// );
							if (verify) {
								let unq = sub.docs[0].data().A;
								setResp(unq);
								// let promises = unq.map((element) => {
								// 	if (element.respondido !== true) {
								// 		return verifyNumUsp(
								// 			element.sheetId,
								// 			numUsp
								// 		);
								// 	} else {
								// 		return element.respondido;
								// 	}
								// });
								// let unq2 = await Promise.all(promises);
								// console.log("unq2", unq2);
								// unq2.forEach((element) => {
								// 	let obj = unq.find(
								// 		(e) =>
								// 			unq.indexOf(e) ===
								// 			unq2.indexOf(element)
								// 	);
								// 	// console.log(
								// 	// 	element.nome,
								// 	// 	element.respondido
								// 	// );
								// 	if (
								// 		element !== obj.respondido &&
								// 		element !== undefined
								// 	) {
								// 		unq[unq.indexOf(obj)].respondido =
								// 			element;
								// 	}
								// });
								// collec.doc().update({ A: unq });
							}
						} else if (sub.docs.length === 0) {
							if (list.length > 0) {
								const query = new Set();
								list.forEach((e) => {
									Object.entries(e.pessoas).forEach(
										(pessoa) => {
											query.add(pessoa[0]);
										}
									);
								});
								const unq = [...query];
								let promises = unq.map((e) => {
									let obj = arr.find(
										(element) => element.nome === e
									);
									var sheet = obj.sheet;
									var sheetId = sheet.slice(
										sheet.lastIndexOf("/") + 1,
										sheet.length
									);
									const resp = verifyNumUsp(sheetId, numUsp);
									return resp;
								});
								var resp = await Promise.all(promises);
								var unq2 = [];
								unq.forEach((e) => {
									let obj = arr.find(
										(element) => element.nome === e
									);
									var sheet = obj.sheet;
									var sheetId = sheet.slice(
										sheet.lastIndexOf("/") + 1,
										sheet.length
									);
									unq2.push({
										nome: e,
										respondido: resp[unq.indexOf(e)],
										sheetId: sheetId,
										form: obj.form,
									});
								});
								setResp(unq2);
							}
							if (
								unq2.length > 0 &&
								typeof unq2[0] === "object"
							) {
								collec.add({ A: unq2 });
							}
						} else {
							throw new Error();
						}
					})
					.then(() => {
						setVerify(false);
					})
					.catch((e) => {
						console.log("Error:", e);
					});
			})
			.catch((error) => {
				alert(error);
			});
	}, [list, arr]);
	const [verify2, setVerify2] = useState(true);
	const [resp2, setResp2] = useState([]);
	useEffect(() => {
		if (resp.length > 0 && verify2) {
			setVerify2(false);
			setResp2(resp);
		}
	}, [resp]);
	useEffect(async () => {
		if (resp2.length > 0 && !verify2) {
			let promises = resp2.map((element) => {
				if (element.respondido !== true) {
					return verifyNumUsp(element.sheetId, numUsp);
				} else {
					return true;
				}
			});
			var respProm = await Promise.all(promises);
			// console.log("respProm", respProm);

			resp2.forEach((element) => {
				if (respProm[resp2.indexOf(element)] !== undefined) {
					element.respondido = respProm[resp2.indexOf(element)];
				} else {
					element.respondido = false;
				}
			});
			// console.log("resp2", resp2);
			db.collection("members")
				.doc(myId)
				.collection("unique")
				.doc()
				.update({ A: resp2 });
		}
	}, [resp2]);
	if (resp.length > 0) {
		// let unique = [];
		// // console.log("resp antes do return", resp);
		// resp.forEach((element) => {
		// 	unique.push(element.nome);
		// });
		return resp;
	} else {
		return [];
	}
}

function Feedback() {
	const [index, setIndex] = useState(0);
	const list = List();
	const [numUsp, setNumUsp] = useState(0);
	const { width } = useWindowDimensions();
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
				setNumUsp(exportData[0].nUsp);
			})
			.catch((error) => {
				alert(error);
			});
	}, [username]);
	// const [unique, setUnique] = useState([]);
	// const [links, setLinks] = useState([]);
	const links = TotalList(list, numUsp);
	const unique = [];
	links.forEach((element) => {
		unique.push(element.nome);
	});
	// useEffect(() => {
	// 	setUnique(unique);
	// 	setLinks(links);
	// }, [list]);
	// console.log(unique.length, links.length);
	const [contagem, setContagem] = useState(true);
	if (contagem && unique.length !== 0) {
		// console.log("unique:", unique);
		// console.log("links:", links);
		// console.log("list:", list);
		setContagem(false);
		// links.map((element) => {
		// if (element.respondido === null) {
		// verifyNumUsp(element.sheet);
		// console.log(element);
		// }
		// 	return;
		// });
	}
	const dias = Dias();

	const [stage, setStage] = useState(0);
	const [prim, setPrim] = useState(true);
	if (prim) {
		setPrim(false);
		setTimeout(() => {
			setTimeout(() => {
				setStage(1);
				setTimeout(() => {
					setStage(2);
					setTimeout(() => {
						setStage(3);
						setTimeout(() => {
							setStage(4);
							setTimeout(() => {
								setStage(5);
								setTimeout(() => {
									setStage(6);
								}, 5000);
							}, 5000);
						}, 5000);
					}, 3000);
				}, 3000);
			}, 3000);
		}, 5000);
	}

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
											<svg
												viewBox="0 0 100 100"
												height="100%"
											>
												<linearGradient
													id="lineara"
													x1="0%"
													y1="50%"
													x2="100%"
													y2="100%"
												>
													<stop
														offset="0%"
														stopColor={
															stage >= 3
																? "#B66004"
																: "#04A0B6"
														}
													/>
													<stop
														offset="80%"
														stopColor={
															stage >= 3
																? "#bd1f1f"
																: "#1fddbd"
														}
													/>
												</linearGradient>
												<rect
													fill="url(#lineara)"
													width="100"
													height="100"
												/>
											</svg>
										</div>
									</div>
									<div>
										<p>faltam</p>
										<div>
											<p>{stage >= 3 ? 3 : 0}</p>
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
											{stage >= 3 ? 5 : 0}
										</span>
										formulários
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
										{stage >= 0 ? (
											<tr>
												<td colSpan="4">
													Carregando...
												</td>
											</tr>
										) : (
											""
										)}
										{stage >= 1 ? (
											<tr>
												<td>Psiu</td>
												{stage >= 2 ? (
													<td colSpan="2">
														É você mesmo!
													</td>
												) : (
													""
												)}
												{stage >= 2 ? (
													<td>Vem aqui</td>
												) : (
													""
												)}
											</tr>
										) : (
											""
										)}
										{stage >= 3 ? (
											<tr>
												<td colSpan="4">
													Sabia que faltam 3 dias pro
													feedback acabar?
												</td>
											</tr>
										) : (
											""
										)}
										{stage >= 4 ? (
											<tr>
												<td colSpan="3">
													Mas fica tranquilo, se você
													clicar aqui eu consigo te
													arranjar mais alguns dias
													pra responder
												</td>
												<td>
													<div
														onClick={() => {
															window.open(
																"wiki.gammajrengenharia.com.br",
																"_blank"
															);
														}}
														rel="noopener noreferrer"
													>
														WikiGamma
													</div>
												</td>
											</tr>
										) : (
											""
										)}
										{stage >= 5 ? (
											<tr>
												<td colSpan="3">
													Clica vai, ninguém tá
													olhando
												</td>
												{stage >= 6 ? (
													<td>É rapidinho</td>
												) : (
													""
												)}
											</tr>
										) : (
											""
										)}
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

async function verifyNumUsp(docId, numUsp, start = 2, end = 50) {
	const doc = new GoogleSpreadsheet(docId);
	// console.log("doc", doc);
	// console.log("dentro do useEffect");
	//async () => {
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
		var resp = arr.includes(numUsp);
		// console.log("verifyNumUsp(): ", resp);
		return resp;
		// setTimeout(() => {
		// }, 300);
	} catch (e) {
		console.log(docId, e);
	}
}

function Interpolate(value1) {
	if (
		typeof value1 == "string" &&
		value1[0] == "#" &&
		typeof value2 == "string" &&
		value2[0] == "#"
	) {
		var rgb1 = [
			value1[1] + value1[2],
			value1[3] + value1[4],
			value1[5] + value1[6],
		];
		// var rgb2 = [value2[1]+value2[2],value2[3]+value2[4],value2[5]+value2[6]];
		var [r1, g1, b1] = rgb1.map((element) => {
			var element = [element[0], element[1]];
			var number = 0;
			element.forEach((e) => {
				let num;
				if (e === "f" || e === "F") {
					num = 15;
				} else if (e === "e" || e === "E") {
					num = 14;
				} else if (e === "d" || e === "D") {
					num = 13;
				} else if (e === "c" || e === "C") {
					num = 12;
				} else if (e === "b" || e === "B") {
					num = 11;
				} else if (e === "a" || e === "A") {
					num = 10;
				} else {
					num = parseInt(e);
				}
				if (element.indexOf(e) === 1) {
					num = num * 10;
				}
				number = number + num;
			});
			return number;
		});
		// var [r2,g2,b2] = rgb2.map((element) => {
		// 	var element = [element[0], element[1]];
		// 	var number = 0;
		// 	element.forEach(e => {
		// 		let num;
		// 		if (e === "f" || e === "F") {
		// 			num = 15;
		// 		} else if (e === "e" || e === "E") {
		// 			num = 14;
		// 		} else if (e === "d" || e === "D") {
		// 			num = 13;
		// 		} else if (e === "c" || e === "C") {
		// 			num = 12;
		// 		} else if (e === "b" || e === "B") {
		// 			num = 11;
		// 		} else if (e === "a" || e === "A") {
		// 			num = 10;
		// 		}
		// 		if (element.indexOf(e) === 1) {
		// 			num = num * 10;
		// 		}
		// 		number = number + num;
		// 	});
		// 	return number;
		// });
		return [r1, g1, b1];
	}
}

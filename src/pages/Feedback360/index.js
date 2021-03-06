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
import { feedjson } from "../../config/fire";

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

function Table({ index = 0, links = [], list = [], numUsp = 0 }) {
	const [isLoading, setLoading] = useState(true);
	if (links !== undefined && links.length > 0) {
		setLoading(false);
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
						// className={obj.respondido ? "inactive" : ""}
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
									const idx = links.findIndex(
										(element) => element.nome === e[0]
									);
									var pessoa = links[idx];
									console.log(pessoa.sheet);
									const promise = verifyNumUsp(
										pessoa.sheet,
										numUsp
									);
									const resp = await Promise.all(promise);
									console.log(resp);
									if (resp) {
										alert(
											"Voc?? j?? respondeu este feedback"
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

function TotalList(list, numUsp) {
	const [verify, setVerify] = useState(true);
	const [arr, setArr] = useState({});
	const [resp, setResp] = useState([]);
	const [myId, setMyId] = useState("");
	const [verify2, setVerify2] = useState(true);
	const [resp2, setResp2] = useState([]);
	const [resp3, setResp3] = useState([]);
	var username = firebase.auth().currentUser.displayName;
	useEffect(() => {
		if (arr.length === undefined) {
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
		}
	}, []);
	useEffect(() => {
		if (list.length > 0 && arr.length > 0 && resp.length === 0) {
			if (verify) {
				setVerify(false);
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
									let promises = sub.docs[0].data().A;
									var unq = await Promise.all(promises);
									setResp(unq);
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
											const resp = verifyNumUsp(
												sheetId,
												numUsp
											);
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
												respondido:
													resp[unq.indexOf(e)],
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
							.catch((e) => {
								console.log("Error:", e);
							});
					})
					.catch((error) => {
						alert(error);
					});
			}
		}
	}, [list, arr]);
	const [resp4, setResp4] = useState([]);
	useEffect(() => {
		if (resp2.length === 0 && resp.length > 0) {
			if (resp.length > 0 && verify2) {
				setVerify2(false);
				setResp2(resp);
			}
		}
	}, [resp]);
	useEffect(async () => {
		if (resp3.length === 0) {
			if (resp2.length > 0 && !verify2) {
				let promises = resp2.map((element) => {
					if (element.respondido !== true) {
						return verifyNumUsp(element.sheetId, numUsp);
					} else {
						return true;
					}
				});
				var respProm = await Promise.all(promises);

				resp2.forEach((element) => {
					if (respProm[resp2.indexOf(element)] !== undefined) {
						element.respondido = respProm[resp2.indexOf(element)];
					} else {
						element.respondido = false;
					}
				});
				// Recalcular list para ajustar o Top() e atualizar a cole????o "teams" Firebase
				list.forEach((e) => {
					let respondidos = 0;
					Object.entries(e.pessoas).forEach((pessoa) => {
						var objInResp2 = resp2.find(
							(element) => element.nome === pessoa[0]
						);
						if (objInResp2.respondido === true) {
							respondidos = respondidos + 1;
						}
					});
					if (list[list.indexOf(e)].respondidos < respondidos) {
						list[list.indexOf(e)].respondidos = respondidos;
						members
							.doc(myId)
							.collection("teams")
							.where("team", "==", e.team)
							.get()
							.then((e) => {
								members
									.doc(myId)
									.collection("teams")
									.doc(e.docs[0].id)
									.update({ respondidos: respondidos });
							});
					}
				});

				// Atualizar a cole????o "unique" Firebase
				members
					.doc(myId)
					.collection("unique")
					.get()
					.then((e) => {
						members
							.doc(myId)
							.collection("unique")
							.doc(e.docs[0].id)
							.update({ A: resp2 });
					});
				setResp3(resp2);
			}
		}
	}, [resp2]);
	const [verify3, setVerify3] = useState(true);
	useEffect(() => {
		if (resp3.length > 0 && verify3) {
			setVerify3(false);
			setResp4(resp3);
		}
	}, [resp3]);

	if (!verify3) {
		return { A: resp4, B: list };
	}
	return { A: [], B: [] };
}

function Feedback() {
	const [index, setIndex] = useState(0);
	var list = List();
	const [numUsp, setNumUsp] = useState(0);
	const { width } = useWindowDimensions();
	var user = firebase.auth().currentUser;
	var username = user.displayName;
	var done = 0;
	useEffect(() => {
		members
			.where("apelido", "==", username)
			.get()
			.then(async (querySnapshot) => {
				let promises = querySnapshot.docs.map((doc) => {
					return doc.data();
				});
				const exportData = await Promise.all(promises);
				setNumUsp(exportData[0].nUsp);
			})
			.catch((error) => {
				alert(error);
			});
	}, [username]);
	// const [links, setLinks] = useState([]);
	// const [list2, setList2] = useState([]);
	// var total = TotalList(list, numUsp);
	var links = [
		{
			nome: "Mari",
			sheetId: "1N3jw0GW0iU2op4_6pAM4TPWkB_3rO3Pr_eCbXi31Mto",
			respondido: false,
			form: "https://docs.google.com/forms/d/1xqOPM3-hGy0oexoa3tfvZy28NJ_sY9kbwEzLooRpULI",
		},
		{
			form: "https://docs.google.com/forms/d/1Wd0AIHt0WlS6sHZU1Qjc2nhbTNZxkgaZqk9JBGAMJxw",
			respondido: false,
			sheetId: "16LYcKERYWH_Tr15lfip05OXxfqUtfUFvXgWqj-3ryt4",
			nome: "Ge",
		},
		{
			form: "https://docs.google.com/forms/d/1Aa50Ee8QpwrDiap98mxFra6G3R0GaU9Q5Zo0F2RO1VE",
			sheetId: "1ylV2Pjd93eak_h_N84F5or3wrhI9_WejIiu7-bNrVvY",
			nome: "Suzi",
			respondido: false,
		},
		{
			nome: "Bangu",
			respondido: false,
			sheetId: "1FK8bkDgQ_0ZugXuXqEry5xr6wRBzYT8Wa7HXWMajAzQ",
			form: "https://docs.google.com/forms/d/18DXHWyYErDv0vVjDoWsM_go9LCHug46RD-gjwCERVMg",
		},
		{
			respondido: true,
			nome: "Dan",
			form: "https://docs.google.com/forms/d/1VXUzRuOpOYIoCdN41I0wg5Us94Am-2kbKJAarw58Dl8",
			sheetId: "1Gyk23dCvzj8fzCYmU8Q4eUf7S6S_VjhOLBlwD6MknZ0",
		},
		{
			respondido: false,
			form: "https://docs.google.com/forms/d/1EEbyDwwmTE7j7xG1vbh_zFTKGzni5xqN9JVdwqC7Tz0",
			sheetId: "1HYLy8ZJIkDjVG1VmB69ohYmM2_8PFC6AZMZ-K-sHSwA",
			nome: "Leandro",
		},
		{
			respondido: false,
			form: "https://docs.google.com/forms/d/1tMmG6Ku4XzWQ3XRrDRFKRMeHu2vwG9RB9RFbp6QsUaQ",
			nome: "??lvaro",
			sheetId: "1f0QPIrJdwXV957VQdrsDSU0HRw5mdC9ALo6bZU65zYc",
		},
		{
			nome: "Ciampi",
			sheetId: "1BwoR3t9flj7hXtOdT0GYONxNbKNxGbheIXoaOOWfWnE",
			respondido: false,
			form: "https://docs.google.com/forms/d/1AGgwhhFdR2rW1WICGxUSSEeWoD-E_TZXGNhRL2d86QI",
		},
		{
			sheetId: "1bQLUe52QJZDlUapKvWz2yDE25I-vfb227oNquhcQPTk",
			respondido: true,
			nome: "Moto Moto",
			form: "https://docs.google.com/forms/d/1QhPLVeW3Lp_huIdkeymoV05mR35aaTGzJOxZeCKAYnk",
		},
		{
			respondido: false,
			nome: "Luiza",
			sheetId: "1AiwubuwBwxD1ulLJ3ZqPdlT6OhLoF4Q9tETOt3JjeDQ",
			form: "https://docs.google.com/forms/d/1hNw20WhnKJli_z6HmGDSLATUPR0C1qNn3vBsOQTry9s",
		},
		{
			form: "https://docs.google.com/forms/d/1-1beJaz6tcS5EYyVAJwVutuyTjJa5f5LBQZwrWZluIg",
			sheetId: "1IK9hpqwa0xwmzwIGzzDsI-4SWYlhHk0ge_wvf9dgsPw",
			nome: "Valentino",
			respondido: false,
		},
		{
			sheetId: "1gt384YKznkF-nmt5xt7CWuG7UC6huwRpJBqZdzZlXOM",
			form: "https://docs.google.com/forms/d/1kGbzoTYZvYgx2QDfWKI2pgcWMDYu1lcas1NT8x4_ofE",
			respondido: false,
			nome: "Mar??",
		},
		{
			sheetId: "17X183DSwGv3M3maCAOafc6vUEIUI58keFgLYAIMMPAY",
			nome: "Penti",
			respondido: false,
			form: "https://docs.google.com/forms/d/1OOdrUzVHvoAJ22Zni7bGh1cBJPDeWplyYX-tvmbO3OI",
		},
		{
			form: "https://docs.google.com/forms/d/10WomM2Y4YgYmxEQUSYXpODngWu13n8MUMmV9boxIJhs",
			sheetId: "1N4G8lAPzjg47JvPoXlS9MGwZJBRsYZx-tllb5uFDs1s",
			nome: "Lucas",
			respondido: false,
		},
		{
			form: "https://docs.google.com/forms/d/1Gxx-zVUNMm0JfsQfbOD9EXDUMQosIo_onWxqzhDw8tA",
			sheetId: "1r5mfU1wiFd4rpXTN0-2BQuOZ5r-fP1aQEQ-OOigPIts",
			nome: "Samu",
			respondido: false,
		},
		{
			respondido: false,
			sheetId: "1xjYzpR851a_oD440J3uSO4T0LlskBEr8hWGeziYNceg",
			nome: "Duda",
			form: "https://docs.google.com/forms/d/1SvfyxQqCpJEmkqLVwwGvW-tqQ2zbwjkPNcO8XpUEqKk",
		},
		{
			nome: "Heims",
			sheetId: "1fdqxtvIaEnTkoWzkOjPrmWA1tesWbiT3AwkkmgFH-lQ",
			respondido: false,
			form: "https://docs.google.com/forms/d/1Doa5GlXPP_enGVI4opFJB1a_0-lWRCMiSXSSRjzBAwk",
		},
		{
			form: "https://docs.google.com/forms/d/1LguTXP9zPi_Kvrw404E8mahJsTLQAqidk5aXdQdrsO8",
			nome: "Nabia",
			sheetId: "1XfAVHcIMEU3efet_pAE3meQLhpAbMFCPiNjZzMYM3uQ",
			respondido: false,
		},
	];
	var list2 = [
		{
			respondidos: 2,
			team: "Realiza????es",
			total: 9,
			pessoas: {
				"Moto Moto": ["Realiza????es"],
				Mari: ["Realiza????es, Projeto Project Lab, Diretoria"],
				??lvaro: ["Realiza????es"],
				Ciampi: ["Realiza????es, Lideran??a, Diretoria"],
				Suzi: ["Realiza????es, Lideran??a"],
				Leandro: ["Realiza????es, N??cleo de App"],
				Dan: ["Realiza????es"],
				Bangu: ["Realiza????es, N??cleo de App, Diretoria"],
				Ge: ["Realiza????es, N??cleo de App"],
			},
		},
		{
			respondidos: 0,
			pessoas: {
				Mar??: ["Projeto Lojas JB"],
				Luiza: ["Projeto Lojas JB, Diretoria"],
				Valentino: ["Projeto Lojas JB"],
			},
			total: 3,
			team: "Projeto Lojas JB",
		},
		{
			team: "N??cleo de App",
			total: 5,
			respondidos: 0,
			pessoas: {
				Ge: ["Realiza????es, N??cleo de App"],
				Penti: ["N??cleo de App"],
				Lucas: ["N??cleo de App"],
				Leandro: ["Realiza????es, N??cleo de App"],
				Bangu: ["Realiza????es, N??cleo de App, Diretoria"],
			},
		},
		{
			team: "Projeto Project Lab",
			total: 2,
			respondidos: 0,
			pessoas: {
				Samu: ["Lideran??a, Projeto Project Lab, Diretoria"],
				Mari: ["Realiza????es, Projeto Project Lab, Diretoria"],
			},
		},
		{
			team: "Lideran??a",
			respondidos: 0,
			pessoas: {
				Samu: ["Lideran??a, Projeto Project Lab, Diretoria"],
				Duda: ["Lideran??a"],
				Suzi: ["Realiza????es, Lideran??a"],
				Ciampi: ["Realiza????es, Lideran??a, Diretoria"],
			},
			total: 4,
		},
		{
			team: "Diretoria",
			total: 7,
			respondidos: 0,
			pessoas: {
				Samu: ["Lideran??a, Projeto Project Lab, Diretoria"],
				Mari: ["Realiza????es, Projeto Project Lab, Diretoria"],
				Nabia: ["Diretoria"],
				Ciampi: ["Realiza????es, Lideran??a, Diretoria"],
				Luiza: ["Projeto Lojas JB, Diretoria"],
				Bangu: ["Realiza????es, N??cleo de App, Diretoria"],
				Heims: ["Diretoria"],
			},
		},
	];
	// teste
	// if (total.A.length !== 0 && total.B.length !== 0) {
	// 	console.log("A", total.A.length, "B", total.B.length);
	// links = total.A;
	// list2 = total.B;
	// }
	// useEffect(() => {
	// 	setLinks(total.A);
	// 	setList2(total.B);
	// }, [total]);
	console.log("links", links);
	console.log("list2", list2);
	const unique = [];
	links.forEach((element) => {
		unique.push(element.nome);
	});
	var respostasUnique = 0;
	links.forEach((element) => {
		if (element.respondido) {
			respostasUnique = respostasUnique + 1;
		}
	});
	if (links.length > 0) {
		done = Math.floor((respostasUnique * 100) / links.length);
	}
	const dias = Dias();

	// if (user) {
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
										<Top list={list2} />
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
										{Math.ceil(
											(unique.length - respostasUnique) /
												dias
										)}
									</span>
									formul??rio
									{Math.ceil(
										(unique.length - respostasUnique) / dias
									) > 1
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
								<Teams setIndex={setIndex} list={list2} />
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
										list={list2}
										numUsp={numUsp}
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
						<h2>D??vidas Sobre como responder o Feedback 360?</h2>
						<h3>Eu preciso responder de todo mundo?</h3>
						<p>
							Voc?? ir?? responder apenas daqueles que voc?? trabalha
							atualmente (ex: diret??rios, n??cleos, projetos,
							departamentos)
						</p>
						<h3>
							N??o tenho uma opini??o formatada sobre fulano, e
							agora?
						</h3>
						<p>
							Escreva com base no que voc?? trabalhou com a pessoa
							e seja o mais sincero poss??vel, caso ache que est??
							muito simples coloque uma observa????o ???n??o tenho uma
							opini??o formada sobre???
						</p>
						<h3>Por que eu preciso responder de tantas pessoas?</h3>
						<p>
							Com o seu feedback voc?? est?? dando a oportunidade da
							outra pessoa poder evoluir mais ainda, e assim fazer
							com que a empresa Gamma Jr cres??a ainda mais.
						</p>
						<h2>Ficou com mais alguma d??vida?</h2>
						<p>
							Entre em contato com algum membro de GP para que
							possa te orientar melhor. N??o fique com vergonha de
							perguntas idiotas, toda d??vida ?? v??lida e pode ser a
							d??vida de outra pessoa tamb??m.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
	// }
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
		return resp;
	} catch (e) {
		console.log(docId, e);
	}
}

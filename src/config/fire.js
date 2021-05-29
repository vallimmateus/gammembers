// import React from "react";
import firebase from "firebase";
import "firebase/firestore";

var firebaseConfig = {
	apiKey: "AIzaSyDj-c47vfOvHXC8OXeaXpL6s0aCfiWZm9s",
	authDomain: "feedback-360-292622.firebaseapp.com",
	projectId: "feedback-360-292622",
	storageBucket: "feedback-360-292622.appspot.com",
	messagingSenderId: "1004921300620",
	appId: "1:1004921300620:web:048afef3ce837c30fabda9",
	measurementId: "G-W1XRGS8GQD",
};

const fire = firebase.initializeApp(firebaseConfig);

export var db = firebase.firestore();
export var members = db.collection("members"); //.withConverter(memberConverter);

// class Members extends React.Component {
// 	constructor(apelido, cargos, emailUsp, nUsp, nome) {
// 		super();
// 		this.apelido = apelido;
// 		this.cargos = cargos;
// 		this.emailUsp = emailUsp;
// 		this.nUsp = nUsp;
// 		this.nome = nome;
// 	}
// }

// var memberConverter = {
// 	toFirestore: function (member) {
// 		return {
// 			apelido: member.apelido,
// 			cargos: member.cargos,
// 			emailUsp: member.emailUsp,
// 			nUsp: member.nUsp,
// 			nome: member.nome,
// 		};
// 	},
// 	fromFirestore: function (snapshot, options) {
// 		const data = snapshot.data(options);
// 		return new Members(
// 			data.apelido,
// 			data.cargos,
// 			data.emailUsp,
// 			data.nUsp,
// 			data.nome
// 		);
// 	},
// };

export async function getMemberByEmail(email) {
	// const member =
	console.log(
		"1: ",
		members
			.where("emailUsp", "==", email)
			.get()
			.then((querySnapshot) => {
				querySnapshot.docs.map(async (doc) => {
					return await doc.data().nome;
				});
			})
	);
	// console.log("1: ", member);
	// return member;
}

export default fire;

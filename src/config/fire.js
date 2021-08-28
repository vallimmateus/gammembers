// import React from "react";
import firebase from "firebase";
import "firebase/firestore";

var firebaseConfig = {
	apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
};

export var feedjson = {
	type: process.env.PUBLIC_FIREBASE_SERVICE_ACCOUNT,
	project_id: process.env.PUBLIC_FIREBASE_PROJECT_ID,
	private_key_id: process.env.PUBLIC_FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.PUBLIC_FIREBASE_API_KEY,
	client_email: process.env.PUBLIC_FIREBASE_CLIENT_EMAIL,
	client_id: process.env.PUBLIC_FIREBASE_CLIENT_ID,
	auth_uri: process.env.PUBLIC_FIREBASE_AUTH_URI,
	token_uri: process.env.PUBLIC_FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url:
		process.env.PUBLIC_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
	client_x509_cert_url: process.env.PUBLIC_FIREBASE_CLIENT_X509_CERT_URL,
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

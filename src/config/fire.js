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

var db = firebase.firestore();

export const getMemberByEmail = (email) => {
	return db
		.collection("members")
		.where("emailUsp", "==", email)
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				console.log(doc.id, " => ", doc.data().nome);
			});
		});
	// .doc("efMjuuoK6haAismVuYEh")
	// .onSnapshot((doc) => {
	// 	console.log(doc.data().emailUsp);
	// })
};

export default fire;

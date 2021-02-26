import firebase from "firebase";

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

export default fire;

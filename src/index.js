import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
	palette: {
		primary: { main: "#1fddbd" },
		secondary: { main: "#212121" },
	},
	typography: { fontFamily: "montserrat" },
});

ReactDOM.render(
	// <React.StrictMode>
	<BrowserRouter>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</BrowserRouter>,
	// </React.StrictMode>
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

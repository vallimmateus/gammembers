import "./App.css";
import Perfil from "./images/Fotos.png";

function App() {
	return (
		<div className="Container">
			<div className="InContainer">
				<img src={Perfil} className="Perfil" alt="perfil" />
				<p>Email USP</p>
				<input />
			</div>
		</div>
	);
}

export default App;

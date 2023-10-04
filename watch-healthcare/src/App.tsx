import "./App.css";
import { RootState } from "./store/store";
import Clock from "./components/Clock/Clock";

function App() {
	return (
		<div className="container">
			<Clock></Clock>
		</div>
	);
}

export default App;

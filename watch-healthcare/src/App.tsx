import React, { useState } from "react";
import Clock from "./components/Clock/Clock";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
	const [clocks, setClocks] = useState<{ id: string; timeZone: string }[]>([]);
	const [selectedTimeZone, setSelectedTimeZone] = useState<string>("");

	const handleAddClock = () => {
		if (selectedTimeZone) {
			const newClock = {
				id: uuidv4(),
				timeZone: selectedTimeZone,
			};
			setClocks([...clocks, newClock]);
			setSelectedTimeZone("");
		}
	};

	const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTimeZone(e.target.value);
	};

	return (
		<div className="app">
			<div className="time-zone-selector">
				<select value={selectedTimeZone} onChange={handleTimeZoneChange}>
					<option value="">Select a Time Zone</option>
					<option value="GMT+1">GMT+1</option>
					<option value="GMT+2">GMT+2</option>
				</select>
				<button className="add-clock-button" onClick={handleAddClock}>
					Add Clock
				</button>
			</div>
			<div className="clocks">
				{clocks.map((clock) => (
					<Clock key={clock.id} timeZone={clock.timeZone} />
				))}
			</div>
		</div>
	);
}

export default App;

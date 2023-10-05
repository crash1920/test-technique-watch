import React, { useEffect, useRef, useState } from "react";
import "./Clock.css";

function Clock({ timeZone }: { timeZone: string }) {
	const [time, setTime] = useState<string>(getCurrentTime(timeZone));
	const [editable, setEditable] = useState(false);
	const [mode, setMode] = useState(0);
	const [timeChanged, setTimeChanged] = useState(false);
	const [isNightMode, setIsNightMode] = useState(false);
	const [localTime, setLocalTime] = useState<string>(getCurrentTime(timeZone));
	const [is24HourFormat, setIs24HourFormat] = useState(true);

	const currentTimeIntervalRef: any = useRef(null);
	function getCurrentTime(timeZone: string) {
		const now = new Date();
		const offset = timeZone === "GMT+1" ? -1 : 0;
		now.setHours(now.getHours() + offset);

		const hours = now.getHours().toString().padStart(2, "0");
		const minutes = now.getMinutes().toString().padStart(2, "0");
		const seconds = now.getSeconds().toString().padStart(2, "0");
		return `${hours}:${minutes}:${seconds}`;
	}
	function addOneSecond(time: string): string {
		const [hours, minutes, seconds] = time.split(":").map(Number);

		let newSeconds = seconds + 1;
		let newMinutes = minutes;
		let newHours = hours;

		if (newSeconds === 60) {
			newSeconds = 0;
			newMinutes += 1;
			if (newMinutes === 60) {
				newMinutes = 0;
				newHours = (newHours + 1) % 24;
			}
		}

		const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);
		return `${pad(newHours)}:${pad(newMinutes)}:${pad(newSeconds)}`;
	}
	useEffect(() => {
		if (mode === 1 || mode === 2) {
			setEditable(true);
		} else {
			setEditable(false);
		}
	}, [mode]);
	useEffect(() => {
		if (isNightMode) {
			document.body.classList.add("night-mode");
		} else {
			document.body.classList.remove("night-mode");
		}
	}, [isNightMode]);

	useEffect(() => {
		if (!timeChanged) {
			currentTimeIntervalRef.current = setInterval(() => {
				const currentTime = getCurrentTime(timeZone);
				setLocalTime(currentTime);
				setTime(currentTime);
			}, 1000);
		} else {
			if (currentTimeIntervalRef.current !== null) {
				clearInterval(currentTimeIntervalRef.current);
				currentTimeIntervalRef.current = null;
			}
		}
	}, [timeChanged]);

	useEffect(() => {
		if (mode === 0 && timeChanged) {
			const updateTimeInterval = setInterval(() => {
				const updatedTime = addOneSecond(time);
				setTime(updatedTime);
				setLocalTime(updatedTime);
			}, 1000);

			return () => clearInterval(updateTimeInterval);
		}
	}, [mode, timeChanged, localTime]);

	const handleReset = () => {
		const currentTime = getCurrentTime(timeZone);
		setTime(currentTime);
		setLocalTime(currentTime);
		setTimeChanged(false);
	};

	const toggleLight = () => {
		setIsNightMode(!isNightMode);
	};

	const handleIncrease = () => {
		if (editable) {
			if (mode === 1) {
				const [hours, minutes, seconds] = localTime.split(":").map(Number);

				if (hours === 23) {
					const updatedTime = `00:${String(minutes).padStart(2, "0")}:${String(
						seconds
					).padStart(2, "0")}`;
					setTime(updatedTime);
					setLocalTime(updatedTime);
				} else {
					const updatedTime = `${String(hours + 1).padStart(2, "0")}:${String(
						minutes
					).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
					setTime(updatedTime);
					setLocalTime(updatedTime);
				}

				setTimeChanged(true);
			} else if (mode === 2) {
				const [hours, minutes, seconds] = localTime.split(":").map(Number);

				if (minutes === 59) {
					if (hours === 23) {
						const updatedTime = "00:00:00";
						setTime(updatedTime);
						setLocalTime(updatedTime);
					} else {
						const updatedTime = `${String(hours + 1).padStart(2, "0")}:00:00`;
						setTime(updatedTime);
						setLocalTime(updatedTime);
					}
				} else {
					const updatedTime = `${String(hours).padStart(2, "0")}:${String(
						minutes + 1
					).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
					setTime(updatedTime);
					setLocalTime(updatedTime);
				}

				setTimeChanged(true);
			}
		}
	};

	const toggleFormat = () => {
		setIs24HourFormat(!is24HourFormat);
	};

	const formatTime = (timeString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			hour12: !is24HourFormat,
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		};
		const timeDate = new Date(`2000-01-01T${timeString}`);
		return timeDate.toLocaleTimeString(undefined, options);
	};

	return (
		<div className="container">
			<div className="watch">
				<div className="time-display">
					<div className="time-text">{formatTime(time)}</div>
				</div>

				<div className="mode-button">
					<label>Mode</label>
					<button
						onClick={() => setMode((mode + 1) % 3)}
						id="modeButton"></button>
				</div>
				<div className="increase-button">
					<button
						onClick={handleIncrease}
						id="increaseButton"
						disabled={!editable}></button>
					<label>Increase</label>
				</div>
				<div className="light-button">
					<button onClick={toggleLight} id="lightButton"></button>
					<label>Light</label>
				</div>
				<div className="reset-button">
					<button onClick={handleReset}></button>
					<label>reset</label>
					<button onClick={toggleFormat}></button>
					<label>Format</label>
				</div>
			</div>
		</div>
	);
}

export default Clock;

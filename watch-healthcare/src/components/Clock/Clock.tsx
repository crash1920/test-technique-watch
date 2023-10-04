import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	toggleEditMode,
	increaseHour,
	increaseMinute,
	updateTime,
	getCurrentTime,
} from "./watchSlice";
import "./Clock.css";
import { RootState } from "../../store/store";

function Clock() {
	const { time, editable, mode, timeChanged } = useSelector(
		(state: RootState) => state.watch
	);
	const dispatch = useDispatch();
	const [intervalId, setIntervalId] = useState<number | null>(null);
	const [isNightMode, setIsNightMode] = useState(false);

	useEffect(() => {
		if (isNightMode) {
			document.body.classList.add("night-mode");
		} else {
			document.body.classList.remove("night-mode");
		}
		if (!timeChanged) {
			const intervalId = setInterval(() => {
				const currentTime = getCurrentTime();
				dispatch(updateTime(currentTime));
			}, 1000);

			return () => clearInterval(intervalId);
		} else if (timeChanged) {
			if (intervalId !== null) {
				clearInterval(intervalId);
			}

			const newIntervalId = setInterval(() => {
				console.log(time);
				dispatch(updateTime(time));
			}, 1000);
			return () => clearInterval(newIntervalId);
		}
	}, [editable, mode, dispatch, isNightMode, time, timeChanged]);

	const toggleLight = () => {
		setIsNightMode(!isNightMode);
	};
	return (
		<div className="container">
			<div className="watch">
				<div className="time-display">
					<div className="time-text">{time}</div>
				</div>

				<div className="mode-button">
					<label>Mode</label>
					<button
						onClick={() => dispatch(toggleEditMode())}
						id="modeButton"></button>
				</div>
				<div className="increase-button">
					<button
						onClick={() => {
							if (editable) {
								if (mode === 1) {
									dispatch(increaseHour());
								} else if (mode === 2) {
									dispatch(increaseMinute());
								}
							}
						}}
						id="increaseButton"
						disabled={!editable}></button>
					<label>increase</label>
				</div>
				<div className="light-button">
					<button onClick={toggleLight} id="lightButton"></button>
					<label>Light</label>
				</div>
			</div>
		</div>
	);
}

export default Clock;

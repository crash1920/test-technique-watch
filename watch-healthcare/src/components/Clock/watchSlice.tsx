import { createAction, createSlice } from "@reduxjs/toolkit";

const watchSlice = createSlice({
	name: "watch",
	initialState: {
		time: getCurrentTime(),
		editable: false,
		mode: 0,
		timeChanged: false,
	},
	reducers: {
		toggleEditMode: (state) => {
			if (state.mode != 2) {
				state.mode += 1;
				state.editable = true;
			} else {
				state.mode = 0;
				state.editable = false;
			}
		},
		updateTime: (state, action) => {
			state.time = action.payload;
		},
		increaseHour: (state) => {
			if (state.editable && state.mode === 1) {
				const [hours, minutes, seconds] = state.time.split(":").map(Number);

				if (hours === 23) {
					state.time =
						"00:" +
						minutes.toString().padStart(2, "0") +
						":" +
						seconds.toString().padStart(2, "0");
				} else {
					state.time = `${(hours + 1).toString().padStart(2, "0")}:${minutes
						.toString()
						.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
				}

				state.timeChanged = true;
			}
		},

		increaseMinute: (state) => {
			if (state.editable && state.mode === 2) {
				const [hours, minutes, seconds] = state.time.split(":").map(Number);

				if (minutes === 59) {
					if (hours === 23) {
						state.time = "00:00:00";
					} else {
						state.time = `${(hours + 1).toString().padStart(2, "0")}:00:00`;
					}
				} else {
					state.time = `${hours.toString().padStart(2, "0")}:${(minutes + 1)
						.toString()
						.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
				}
				state.timeChanged = true;
			}
		},
	},
});

export function getCurrentTime() {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, "0");
	const minutes = now.getMinutes().toString().padStart(2, "0");
	const seconds = now.getSeconds().toString().padStart(2, "0");
	return `${hours}:${minutes}:${seconds}`;
}

export const { toggleEditMode, updateTime, increaseHour, increaseMinute } =
	watchSlice.actions;
export default watchSlice.reducer;

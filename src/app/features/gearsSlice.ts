import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store";

export interface GearParameters {
	teethCount: number,
	pitchDiameter: number,
	speedRpm: number,
	id: number
}

interface GearsState {
	gears: GearParameters[],
	selected?: number,
	nextId: number,
};

const initialState: GearsState = {
	gears: [{
		teethCount: 20,
		pitchDiameter: 8,
		speedRpm: 30,
		id: 0
	}],
	nextId: 1
}

export const gearsSlice = createSlice({
	name: "gears",
	initialState,
	reducers: {
		makeGear: (state, action: PayloadAction<{ teethCount: number, pitchDiameter: number }>) => {
			/* let newId = 0;
			if (state.gears.length > 0) {
				newId = state.gears[state.gears.length - 1].id + 1;
			} */
			state.gears.push({ ...action.payload, speedRpm: 0, id: state.nextId });
			state.nextId++;
			console.log("making gear");
		},
		deleteGear: (state, action: PayloadAction<number>) => {
			state.gears = state.gears.filter(e => e.id != action.payload);
			/* const gearIndex = state.gears.map((e, i) => {
				if (e.id == action.payload) {
					return i
				}
			}).filter(e => e !== undefined)[0]!;
			state.gears.splice(gearIndex, 1);
			state.gears.map(e => console.log(e.id)); */
		},
		setSelected: (state, action: PayloadAction<number | undefined>) => {
			state.selected = action.payload;
		}
	}
});

export const { makeGear, deleteGear, setSelected } = gearsSlice.actions;
export const selectedGear = (state: RootState) => state.gears.selected;
export default gearsSlice.reducer
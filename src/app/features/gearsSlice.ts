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
	selectedId?: number,
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
			state.gears.push({ ...action.payload, speedRpm: 0, id: state.nextId });
			state.nextId++;
			console.log("making gear");
		},
		deleteGear: (state, action: PayloadAction<number>) => {
			state.gears = state.gears.filter(e => e.id != action.payload);
		},
		setSelected: (state, action: PayloadAction<number | undefined>) => {
			state.selectedId = action.payload;
		},
		setSpinSpeed: (state, action: PayloadAction<number>) =>{
			const allIds = state.gears.map(e=>e.id);
			const selectedIndex = allIds.indexOf(state.selectedId!);
			state.gears[selectedIndex].speedRpm = action.payload;
		}
	}
});

export const { makeGear, deleteGear, setSelected, setSpinSpeed } = gearsSlice.actions;
export const selectedGear = (state: RootState) => state.gears.selectedId;
export default gearsSlice.reducer
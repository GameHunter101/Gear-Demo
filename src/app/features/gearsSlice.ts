import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store";

export interface GearParameters {
	teethCount: number,
	pitchDiameter: number,
	speedRpm: number,
	id: number,
	reversed: boolean,
	gearRefs?: React.MutableRefObject<(SVGGElement | null)[]>
}

interface GearsState {
	gears: GearParameters[],
	nextId: number,
	selectedId?: number,
	selectedModule?: number,
	isLinking: boolean,
	linkedIndices: number[];
};

const initialState: GearsState = {
	gears: [{
		teethCount: 20,
		pitchDiameter: 8,
		speedRpm: 30,
		id: 0,
		reversed: false
	}],
	nextId: 1,
	isLinking: false,
	linkedIndices: []
}

export const gearsSlice = createSlice({
	name: "gears",
	initialState,
	reducers: {
		makeGear: (state, action: PayloadAction<{ teethCount: number, pitchDiameter: number }>) => {
			state.gears.push({ ...action.payload, speedRpm: 0, id: state.nextId, reversed: state.nextId % 2 == 1 });
			state.nextId++;
		},
		deleteGear: (state, action: PayloadAction<number>) => {
			state.gears = state.gears.filter(e => e.id != action.payload);
		},
		setSelected: (state, action: PayloadAction<number | undefined>) => {
			state.selectedId = action.payload;
			if (action.payload !== undefined) {
				const allIds = state.gears.map(e => e.id);
				const selectedIndex = allIds.indexOf(action.payload);
				state.selectedModule = state.gears[selectedIndex].pitchDiameter / state.gears[selectedIndex].teethCount;
			} else {
				state.selectedModule = undefined;
			}
		},
		setSpinSpeed: (state, action: PayloadAction<number>) => {
			const allIds = state.gears.map(e => e.id);
			const selectedIndex = allIds.indexOf(state.selectedId!);
			state.gears[selectedIndex].speedRpm = action.payload;
		},
		toggleLinking: (state) => {
			state.isLinking = !state.isLinking;
		},
		linkGear: (state, action: PayloadAction<number>) => {
			const allIds = state.gears.map(e => e.id);
			const selectedIndex = allIds.indexOf(action.payload);
			if (state.linkedIndices.length === 2) {
				state.linkedIndices = [selectedIndex];
			} else {
				state.linkedIndices.push(selectedIndex);
			}
			if (state.linkedIndices.length === 2) {
				const parentGear = state.gears[state.linkedIndices[0]];
				const childGear = state.gears[state.linkedIndices[1]];
				childGear.speedRpm = (parentGear.teethCount / childGear.teethCount) * parentGear.speedRpm;
				childGear.reversed = !parentGear.reversed;
				parentGear.reversed = !childGear.reversed;
			}
		}
	}
});

export const { makeGear, deleteGear, setSelected, setSpinSpeed, toggleLinking, linkGear } = gearsSlice.actions;
export const selectedGear = (state: RootState) => state.gears.selectedId;
export default gearsSlice.reducer
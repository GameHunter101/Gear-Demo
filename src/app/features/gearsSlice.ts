import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store";

interface GearsState {
    gears: {
        teethCount: number,
        pitchDiameter: number,
        speedRpm: number,
        id: number
    }[],
    selected?: number
};

const initialState: GearsState = {
    gears: [{
        teethCount: 20,
        pitchDiameter: 8,
        speedRpm: 30,
        id: 0
    }]
}

export const gearsSlice = createSlice({
    name: "gears",
    initialState,
    reducers: {
        makeGear: (state, action: PayloadAction<{teethCount:number,pitchDiameter:number}>) => {
            state.gears.push({...action.payload,speedRpm:0, id: state.gears[state.gears.length-1].id+1});
            console.log("making gear")
        },
        deleteGear: (state,action: PayloadAction<number>) =>{
            state.gears.splice(action.payload,1);
        },
        setSelected: (state, action:PayloadAction<number|undefined>)=>{
            state.selected = action.payload;
        }
    }
});

export const {makeGear, deleteGear, setSelected} = gearsSlice.actions;
export const selectedGear = (state:RootState)=> state.gears.selected;
export default gearsSlice.reducer
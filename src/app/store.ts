import {configureStore} from "@reduxjs/toolkit";
import gearsReducer from "./features/gearsSlice";

const store = configureStore({
    reducer: {
        gears: gearsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
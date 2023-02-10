import { useState, useEffect, useRef, RefObject } from "react";
import "./App.css";
import { deleteGear, selectedGear, makeGear, setSelected } from "./app/features/gearsSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Gear from "./Gear";
import TopBar from "./TopBar";

function App() {
	const { gears } = useAppSelector(state => state.gears);
	const dispatch = useAppDispatch();

	const handleClick = (e: MouseEvent) => {
		if ((e.target as HTMLDivElement).tagName === "svg") {
			dispatch(setSelected(undefined));
		}
	}

	useEffect(() => {
		window.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("click", handleClick);
		}
	})

	const gearComponents = gears.map((gear, i) => {
		return (
			<Gear teethCount={gear.teethCount} pitchDiameter={gear.pitchDiameter} id={gear.id} key={gear.id} speedRpm={gear.speedRpm} reversed={gear.reversed} />
		)
	});


	return (
		<div className="App relative">
			<TopBar />
			<svg
				className="pt-12"
				width={"100vw"}
				height={"100vh"}
				xmlns="http://www.w3.org/2000/svg"
			>
				{gearComponents}
			</svg>
		</div>
	)
}

export default App

import { useState, useEffect, useRef, RefObject } from "react";
import { FpsView } from "react-fps";
import "./App.css";
import { deleteGear, selectedGear, makeGear, setSelected } from "./app/features/gearsSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Gear from "./Gear";
import TopBar from "./TopBar";


function App() {
	const { gears, linkedIndices, selectedModule } = useAppSelector(state => state.gears);
	const dispatch = useAppDispatch();

	/* const [debugTrianglePoints, setDebugTrianglePoints] = useState("");
	const [debugSmallTrianglePoints, setDebugSmallTrianglePoints] = useState("");
	const [debugPoint, setDebugPoint] = useState({ x: 0, y: 0 });
	const [childCenter, setChildCenter] = useState({ x: 0, y: 0 });
	const [parentCenter, setParentCenter] = useState({ x: 0, y: 0 });
 */
	const handleClick = (e: MouseEvent) => {
		if ((e.target as HTMLDivElement).tagName === "svg") {
			dispatch(setSelected(undefined));
		}
	}

	useEffect(() => {
		window.addEventListener("click", handleClick);
		// window.addEventListener("mousemove", debugTriangle);

		return () => {
			window.removeEventListener("click", handleClick);
			// window.removeEventListener("mousemove", debugTriangle);
		}
	});


	const gearRefs = useRef<(SVGGElement | null)[]>([]);
	const pixelToCm = 0.026458;

	const gearComponents = gears.map((gear, i) => {
		return (
			<Gear
				teethCount={gear.teethCount}
				pitchDiameter={gear.pitchDiameter}
				id={gear.id}
				key={gear.id}
				speedRpm={gear.speedRpm}
				reversed={gear.reversed}
				gearRefs={gearRefs}
				ref={e => gearRefs.current[i] = e}
				rotationOffset={gear.rotationOffset}
			/>
		)
	});

	return (
		<div className="App relative">
			<TopBar />
			<svg
				// className="pt-12"
				width={"100vw"}
				height={"100vh"}
				xmlns="http://www.w3.org/2000/svg"
			>
				{gearComponents}
			</svg>
			<FpsView />
		</div>
	)
}

export default App

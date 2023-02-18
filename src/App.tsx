import { useState, useEffect, useRef, RefObject } from "react";
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
			/>
		)
	});
	/* const lerp = (t: number, x0: number, x1: number): number => {
		return (1 - t) * x0 + t * x1;
	}
	const yPosAtX = (px: number, x0: number, y0: number, x1: number, y1: number) => {
		return y0 + (px-x0)*(y1-y0)/(x1-x0);
	}
	const debugTriangle = () => {
		const parentGear = gearRefs!.current[linkedIndices[0]];
		const parentPosition = formatGearPosition(getGearPosition(parentGear));
		const parentGearParameters = gears[linkedIndices[0]];

		const childGear = gearRefs!.current[linkedIndices[1]]!;
		const childPosition = formatGearPosition(getGearPosition(childGear))!;
		const childGearParameters = gears[linkedIndices[1]];
		if (parentPosition !== null && childPosition !== null) {
			const parentWidth = getWidth(parentGearParameters.pitchDiameter, selectedModule!);
			const childWidth = getWidth(childGearParameters.pitchDiameter, selectedModule!);
			const childCenter = { x: childPosition.x + childWidth / 2, y: childPosition.y + childWidth / 2 };
			const parentCenter = { x: parentPosition.x + parentWidth / 2, y: parentPosition.y + parentWidth / 2 };

			const dist = Math.sqrt((parentCenter.x - childCenter.x) ** 2 + (parentCenter.y - childCenter.y) ** 2);
			const targetDist = parentGearParameters.pitchDiameter / (2 * pixelToCm) + childGearParameters.pitchDiameter / (2 * pixelToCm);
			const ratio = targetDist/dist;
			console.log(ratio);
			const xPos = lerp(ratio, parentCenter.x, childCenter.x);
			const yPos = yPosAtX(xPos, parentCenter.x, parentCenter.y, childCenter.x, childCenter.y);
			// const yPos = lerp(ratio,parentCenter.y,childCenter.y);
			setDebugPoint({ x:xPos,y:yPos});
			setChildCenter(childCenter)
			setParentCenter(parentCenter)
			setDebugTrianglePoints(`${parentCenter.x},${parentCenter.y} ${parentCenter.x},${childCenter.y} ${childCenter.x},${childCenter.y}`);
			setDebugSmallTrianglePoints(`${parentCenter.x},${parentCenter.y} ${parentCenter.x},${childCenter.y + ratio * (parentCenter.y - childCenter.y)} ${childCenter.x + ratio * (parentCenter.x - childCenter.x)},${childCenter.y + ratio * (parentCenter.y - childCenter.y)}`);
		}
	} */

	return (
		<div className="App relative">
			<TopBar />
			<svg
				// className="pt-12"
				width={"100vw"}
				height={"100vh"}
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* <polygon points={debugTrianglePoints} fill="none" stroke="black"></polygon> */}
				{/* <polygon points={debugSmallTrianglePoints} fill="none" stroke="red"></polygon> */}
				{/* <circle transform={"translate("+debugPoint.x+","+debugPoint.y+")"} r={10} fill="green"></circle> */}
				{gearComponents}
			</svg>
		</div>
	)
}

export default App

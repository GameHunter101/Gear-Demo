import { useState, useEffect, useRef, RefObject } from "react";
import "./App.css";
import Gear, { RefType } from "./Gear";

function App() {
	const [gears, setGears] = useState<{ teeth: number, diameter: number, num: number }[]>([{ teeth: 5, diameter: 5, num: 0 }]);
	const [teethCount, setTeethCount] = useState(18);
	const [pitchDiameter, setPitchDiameter] = useState(20);
	const [rpm, setRpm] = useState(60);
	const [selected, setSelected] = useState<number>();

	const gearRefs = useRef<(RefType|null)[]>([]);

	const svgRef = useRef<SVGSVGElement>(null);

	const handleClick = (e: MouseEvent) => {
		if (e.target instanceof SVGPathElement) {
			const index = Array.from(svgRef.current!.children).indexOf(e.target.parentElement!.parentElement!);
			setSelected(index);
			// svgRef.current?.children[selected].setAttribute("fill", "#f00");
		} else {
			if ((e.target as HTMLDivElement).className.includes("App")) {
				setSelected(undefined);
			}
		}
	}

	useEffect(() => {
		window.addEventListener("click", handleClick);

		gears.map((_e, i) => {
			svgRef.current!.children.item(i)!.children[0].children[0].setAttribute("fill-opacity", "0");
		})
		if (selected != undefined) {
			svgRef.current!.children.item(selected)!.children[0].children[0].setAttribute("fill-opacity", ".3");
		}


		return () => {
			window.removeEventListener("click", handleClick);
		}
	}, [selected])

	const gearComponents = gears.map((gear, i) => (
		<Gear teeth={gear.teeth} diameter={gear.diameter} id={i} key={i} num={gear.num} ref={e=>gearRefs.current.push(e)} select={(id) => {
			setSelected(id);
		}} />
	));


	return (
		<div className="App relative">
			<div className="fixed top-0 w-full h-12 bg-[#262626] flex items-center">
				{selected == undefined ?
					<form className="mx-auto grid grid-cols-3 gap-2" onSubmit={(e) => {
						e.preventDefault();
						setGears([...gears, { teeth: teethCount, diameter: pitchDiameter, num: 0 }]);
					}}>
						<div>
							<label htmlFor="numTeeth" className="pr-2 text-white">Number of Teeth: </label>
							<input type="number" id="numTeeth" value={teethCount} className="w-12 bg-transparent focus:outline-none placeholder:text-gray-300 text-gray-300 border-b-[1px]  border-b-gray-700" onChange={e => setTeethCount(e.target.valueAsNumber)} />
						</div>
						<div>
							<label htmlFor="diameter" className="pr-2 text-white">Pitch Diameter (cm): </label>
							<input type="number" id="diameter" value={pitchDiameter} className="w-12 bg-transparent focus:outline-none placeholder:text-gray-300 text-gray-300 border-b-[1px]  border-b-gray-700" onChange={e => setPitchDiameter(e.target.valueAsNumber)} />
						</div>
						<span className="mx-2">
							<button type="submit" className="bg-[#202020] text-white px-4 rounded-full py-1 shadow-sm shadow-[#0000005F] hover:bg-[#A0A0A0] hover:text-[#202020] transition-all duration-100">Make Gear</button>
						</span>
					</form>
					:
					<p></p>
				}
				<form className="mx-auto grid grid-cols-3 gap-2" onSubmit={(e) => {
					e.preventDefault();
					if (gears && selected != undefined) {
						gearRefs.current[selected]?.retrieveSpeed(60/rpm);
					}
				}}>
					<div>
						<label htmlFor="rpm" className="pr-2 text-white">Gear RPM</label>
						<input type="number" id="rpm" value={rpm} className="w-12 bg-transparent focus:outline-none placeholder:text-gray-300 text-gray-300 border-b-[1px]  border-b-gray-700" onChange={e => setRpm(e.target.valueAsNumber)} />
					</div>
					<span className="mx-2">
						<button type="submit" className="bg-[#202020] text-white px-4 rounded-full py-1 shadow-sm shadow-[#0000005F] hover:bg-[#A0A0A0] hover:text-[#202020] transition-all duration-100">Set RPM</button>
					</span>
				</form>
			</div>
			<svg
				xmlns="<http://www.w3.org/2000/svg>"
				className="overflow-visible w-fit h-fit rounded-full pointer-events-none"
				width={"100vw"}
				height={"100vh"}
				ref={svgRef}
			>
				{gearComponents}
			</svg>
		</div>
	)
}

export default App

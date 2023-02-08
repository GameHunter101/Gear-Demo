import { useState, useEffect, useRef, RefObject } from "react";
import "./App.css";
import { deleteGear, selectedGear, makeGear, setSelected } from "./app/features/gearsSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Gear from "./Gear";

function App() {
	const { gears, selected } = useAppSelector(state => state.gears);
	const dispatch = useAppDispatch();

	// const [gears, setGears] = useState<{ teeth: number, diameter: number, num: number }[]>([{ teeth: 10, diameter: 5, num: 0 }]);
	const [teethCount, setTeethCount] = useState(18);
	const [pitchDiameter, setPitchDiameter] = useState(20);
	const [rpm, setRpm] = useState(60);

	const handleClick = (e: MouseEvent) => {
		if ((e.target as HTMLDivElement).className !== ""){
			dispatch(setSelected(undefined));
		}
	}

	useEffect(() => {
		window.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("click", handleClick);
		}
	})

	const gearComponents = gears.map((gear, i) => (
		<Gear teethCount={gear.teethCount} pitchDiameter={gear.pitchDiameter} id={gear.id} key={i} />
	));


	return (
		<div
			className="App relative"
		>
			<div className="fixed top-0 w-full h-12 bg-[#262626] flex items-center">
				{selected === undefined ?
					(<form className="mx-auto grid grid-cols-3 gap-2" onSubmit={(e) => {
						e.preventDefault();
						dispatch(makeGear({ teethCount: 5, pitchDiameter: 15 }));
						console.log(selected)
						// setGears([...gears, { teeth: teethCount, diameter: pitchDiameter, num: 0 }]);
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
					</form>)
					:
					(<form className="mx-auto grid grid-cols-3 gap-2" onSubmit={(e) => {
						e.preventDefault();
						if (gears && selected != undefined && !isNaN(rpm)) {
						}
					}}>
						<div>
							<label htmlFor="rpm" className="pr-2 text-white">Gear RPM</label>
							<input type="number" id="rpm" value={rpm} className="w-12 bg-transparent focus:outline-none placeholder:text-gray-300 text-gray-300 border-b-[1px]  border-b-gray-700" onChange={e => setRpm(e.target.valueAsNumber)} />
						</div>
						<span className="mx-2">
							<button type="submit" className="bg-[#202020] text-white px-4 rounded-full py-1 shadow-sm shadow-[#0000005F] hover:bg-[#A0A0A0] hover:text-[#202020] transition-all duration-100">Set RPM</button>
						</span>
						{/* <span className="mx-2"> */}
							<button type="button" className="bg-[#202020] text-white px-4 rounded-full py-1 shadow-sm shadow-[#0000005F] hover:bg-[#A0A0A0] hover:text-[#202020] transition-all duration-100" onClick={() => {
								dispatch(deleteGear(selected));
							}}>
								Delete Gear
							</button>
						{/* </span> */}
					</form>)
				}
			</div>
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

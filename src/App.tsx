import { useState } from 'react'
import './App.css'
import Gear from './Gear'

function App() {
	const [gears, setGears] = useState<{ teeth: number, diameter: number }[]>([{teeth:5, diameter:5}]);
	const [teethCount, setTeethCount] = useState(18);
	const [pitchDiameter, setPitchDiameter] = useState(20);

	return (
		<div className="App relative">
			<div className="fixed top-0 w-full h-12 bg-[#262626] flex items-center">
				<form className="mx-auto grid grid-cols-3 gap-2" onSubmit={(e) => {
					e.preventDefault();
					setGears([...gears, { teeth: teethCount, diameter: pitchDiameter }]);
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
			</div>

			<svg
				xmlns="<http://www.w3.org/2000/svg>"
				className="overflow-visible w-fit h-fit rounded-full pointer-events-none"
				width={"100vw"}
				height={"100vh"}
			>

				{gears.map((gear, i) => {
					return <Gear teeth={gear.teeth} diameter={gear.diameter} position={{ x: 50, y: 50 }} key={i} />
				})}
			</svg>
		</div>
	)
}

export default App

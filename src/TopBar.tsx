import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks';
import { deleteGear, makeGear, setSpinSpeed } from "./app/features/gearsSlice";

function TopBar() {
    const dispatch = useAppDispatch();
    const { gears, selectedId: selected } = useAppSelector(state => state.gears);

    const [teethCount, setTeethCount] = useState(18);
    const [pitchDiameter, setPitchDiameter] = useState(10);
    const [rpm, setRpm] = useState(30);

    return (
        <div className="fixed top-0 w-full h-12 bg-[#262626] flex items-center">
            {selected === undefined ?
                (<form className="mx-auto grid grid-cols-3 gap-2" onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(makeGear({ teethCount, pitchDiameter }));
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
                    dispatch(setSpinSpeed(rpm));
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
                        console.log(selected);
                        dispatch(deleteGear(selected));
                    }}>
                        Delete Gear
                    </button>
                    {/* </span> */}
                </form>)
            }
        </div>
    )
}

export default TopBar
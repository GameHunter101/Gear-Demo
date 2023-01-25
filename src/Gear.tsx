import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
// import init, {make_gear} from "gear-calc";
import init, { make_gear, test } from "gear-calc";

interface GearProps {
	teeth: number,
	diameter: number,
	position: { x: number, y: number }
}

const Gear = (props: GearProps) => {
	const [points, setPoints] = useState("");
	const pixelToCm = 0.026458;
	/* useEffect(()=>{
		init().then(()=>{
			console.log(make_gear(9,20));
		})
	}) */
	init().then(() => {
		setPoints(make_gear(props.teeth, props.diameter / pixelToCm));
	});
	return (
		<>

			<svg
				xmlns="<http://www.w3.org/2000/svg>"
				className="overflow-visible w-fit h-fit rounded-full pointer-events-none"
				width={(props.diameter + (2 * props.diameter) / props.teeth) / pixelToCm}
				height={(props.diameter + (2 * props.diameter) / props.teeth) / pixelToCm}
			>

				<path
					strokeWidth={"1"}
					stroke="black"
					fill="#00000000"
					d={points}
					className="pointer-events-auto"
					onClick={() => console.log("stuff")}
				>
				</path>
			</svg>
		</>
	);
};

export default Gear;
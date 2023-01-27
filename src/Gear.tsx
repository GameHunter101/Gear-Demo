import React, { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
// import init, {make_gear} from "gear-calc";
import init, { make_gear, test } from "gear-calc";
import Draggable, { DraggableCore } from "react-draggable";

interface GearProps {
	teeth: number,
	diameter: number,
	position: { x: number, y: number }
}

const Gear = (props: GearProps) => {
	const [points, setPoints] = useState("");

	const pathRef = useRef(null);

	const pixelToCm = 0.026458;
	init().then(() => {
		setPoints(make_gear(props.teeth, props.diameter / pixelToCm));
	});
	return (
		<>

			<Draggable nodeRef={pathRef}>
				<path
					strokeWidth={"1"}
					stroke="black"
					fill="#00000000"
					d={points}
					className="pointer-events-auto"
					// transform={`translate(${offsetX + " " + offsetY})`}
					ref={pathRef}
				>
				</path>
			</Draggable>
		</>
	);
};

export default Gear;
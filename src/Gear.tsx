import React, { ForwardedRef, RefObject, useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
// import init, {make_gear} from "gear-calc";
import init, { make_gear, test } from "gear-calc";
import Draggable from "react-draggable";

interface GearProps {
	teeth: number,
	diameter: number,
	id: number,
	select: (id:number)=>void
}

const Gear = (props: GearProps) => {
	const [points, setPoints] = useState("");

	const ref = useRef<SVGPathElement>(null);

	const pixelToCm = 0.026458;
	init().then(() => {
		setPoints(make_gear(props.teeth, props.diameter / pixelToCm));
	});
	return (
		<>

			<Draggable nodeRef={ref as any}>
				<path
					strokeWidth={"1"}
					stroke="black"
					fill="#000"
					fillOpacity={0}
					d={points}
					className="pointer-events-auto"
					// transform={`translate(${offsetX + " " + offsetY})`}
					ref={ref}
					onClick={()=>props.select(props.id)}
				>
				</path>
			</Draggable>
		</>
	);
};

export default Gear;
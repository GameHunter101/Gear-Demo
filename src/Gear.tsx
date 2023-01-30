import React, { ForwardedRef, forwardRef, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
// import init, {make_gear} from "gear-calc";
import init, { make_gear, test } from "gear-calc";
import Draggable from "react-draggable";

interface GearProps {
	teeth: number,
	diameter: number,
	id: number,
	select: (id: number) => void,
	num: number
}

export interface RefType {
	retrieveSpeed: (num:number)=>void
}

const Gear = forwardRef<RefType,GearProps>((props: GearProps, ref) => {
	const [points, setPoints] = useState("");
	const [speed,setSpeed] = useState(10);

	const pathRef = useRef<SVGPathElement>(null);

	useEffect(() => {
		console.log(speed);
		// pathRef.current?.classList.add("animate-[spin_5s_linear_infinite]")
	
	}, [speed]);

	const retrieveSpeed = (num:number)=>{
		setSpeed(num);
	};
	
	useImperativeHandle(ref,()=>({retrieveSpeed}))

	// if (ref.current) {
	// 	console.log(ref.current["offsetWidth" as never]);
	// }
	const pixelToCm = 0.026458;
	init().then(() => {
		setPoints(make_gear(props.teeth, props.diameter / pixelToCm));
	});
	const className = `pointer-events-auto origin-center animate-[spin_${speed}s_linear_infinite]`;
	return (
		<>
			<Draggable nodeRef={pathRef as any}>
				<foreignObject width={(props.diameter + 3 * (props.diameter / props.teeth)) / pixelToCm} height={(props.diameter + 3 * (props.diameter / props.teeth)) / pixelToCm}>
					<svg
						xmlns="<http://www.w3.org/2000/svg>"
						className="overflow-visible w-fit h-fit rounded-full pointer-events-none"
						width={(props.diameter + 3 * (props.diameter / props.teeth)) / pixelToCm}
						height={(props.diameter + 3 * (props.diameter / props.teeth)) / pixelToCm}>
						<path
							strokeWidth={"1"}
							stroke="black"
							fill="#000"
							fillOpacity={0}
							d={points}
							className={className}
							style={{ transformBox: "fill-box" }}
							// transform={`translate(${offsetX + " " + offsetY})`}
							onClick={() => props.select(props.id)}
							ref={pathRef}
						>
						</path>
					</svg>
				</foreignObject>
			</Draggable>
		</>
	);
});

export default Gear;
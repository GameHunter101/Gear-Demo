import React, { ForwardedRef, forwardRef, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import init, { make_gear, test } from "gear-calc";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { GearParameters, linkGear, setSelected, setSpinSpeed, toggleLinking } from "./app/features/gearsSlice";

const Gear = (props: GearParameters) => {
	const dispatch = useAppDispatch();
	const { selectedId: selected, selectedModule, isLinking } = useAppSelector(state => state.gears);

	const [points, setPoints] = useState("");

	const pathRef = useRef<SVGPathElement>(null);

	/* useEffect(()=>{
		if (pathRef.current && props.reversed){
			console.log("reversing");
			pathRef.current.style.animationDirection = "reverse"
		}
	},[]); */

	const pixelToCm = 0.026458;
	const containerSize = (props.pitchDiameter + 2 * (props.pitchDiameter / props.teethCount)) / pixelToCm;
	const speed = props.speedRpm === 0 ? 0 : 60 / props.speedRpm;
	const module = props.pitchDiameter / props.teethCount;

	init().then(() => {
		setPoints(make_gear(props.teethCount, props.pitchDiameter / pixelToCm));
	});
	return (
		<>
			<Draggable nodeRef={pathRef as any}>
				<foreignObject
					width={containerSize}
					height={containerSize}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"

						className="overflow-visible w-fit h-fit rounded-full pointer-events-none relat"
						width={containerSize}
						height={containerSize}
					>
						<path
							stroke={"black"}
							strokeWidth={1}
							fill={`${selected === props.id ? "black" : `${module === selectedModule && isLinking ? "green" : "black"}`}`}
							className={"origin-center pointer-events-auto animate-[spin_0s_linear_infinite]"}
							style={{ transformBox: "fill-box", animation: `1.5s linear ${speed}s infinite ${props.reversed?"reverse":"normal"} none running spin` }}
							fillOpacity={(selected === props.id || (module === selectedModule && isLinking)) ? "0.5" : "0"}
							d={points}
							ref={pathRef}
							onClick={() => {
								dispatch(setSelected(props.id))
								if (isLinking) {
									dispatch(toggleLinking());
									dispatch(linkGear(props.id));
								}
							}}
						>
						</path>
						<text x={containerSize / 2} y={containerSize / 2} dominantBaseline="middle" textAnchor="middle">
							<tspan x="50%" dy="0rem">
								Module: {module}
							</tspan>
							<tspan x="50%" dy="1.1rem">
								Speed: {props.speedRpm} rpm
							</tspan>
							<tspan x="50%" dy="1.1rem">
								Pitch Diameter: {props.pitchDiameter}
							</tspan>
							<tspan x="50%" dy="1.1rem">
								Tooth Count: {props.teethCount}
							</tspan>
						</text>
					</svg>
				</foreignObject>
			</Draggable>
		</>
	);
};

export default Gear;
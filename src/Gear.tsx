import React, { ForwardedRef, forwardRef, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import init, { make_gear, test } from "gear-calc";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { GearParameters, setSelected } from "./app/features/gearsSlice";

const Gear = (props: GearParameters) => {
	const dispatch = useAppDispatch();
	const { selectedId: selected, gears } = useAppSelector(state => state.gears);

	const [points, setPoints] = useState("");

	const pathRef = useRef<SVGPathElement>(null);

	const pixelToCm = 0.026458;
	const containerSize = (props.pitchDiameter + 2 * (props.pitchDiameter / props.teethCount)) / pixelToCm;
	const speed = props.speedRpm === 0? 0: 60 / props.speedRpm;
	// const gearIndex = gears.map((e, i) => { if (e.id == props.id) return i }).filter(e => e !== undefined);
	init().then(() => {
		setPoints(make_gear(props.teethCount, props.pitchDiameter / pixelToCm));
	});
	return (
		<>
			<Draggable nodeRef={pathRef as any}>
				<foreignObject
					width={containerSize}
					height={containerSize}
					className="relative"
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
							fill={"#000"}
							className={"origin-center pointer-events-auto animate-[spin_0s_linear_infinite]"}
							style={{ transformBox: "fill-box", animation: `spin ${speed}s linear infinite` }}
							fillOpacity={selected === props.id ? "0.5" : "0"}
							d={points}
							ref={pathRef}
							onClick={() => dispatch(setSelected(props.id))}
						>
						</path>
						<text x={containerSize/2} y={containerSize/2} dominantBaseline="middle" textAnchor="middle">
							<tspan x="50%"  dy="-1rem">
							Module: {props.pitchDiameter/props.teethCount}
							</tspan>
							<tspan x="50%"  dy="1rem">
							Speed: {props.speedRpm} rpm
							</tspan>
						</text>
					</svg>
				</foreignObject>
			</Draggable>
		</>
	);
};

export default Gear;
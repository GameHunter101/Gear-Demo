import React, { ForwardedRef, forwardRef, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import init, { make_gear, test } from "gear-calc";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { GearParameters, setSelected } from "./app/features/gearsSlice";

const Gear = (props: GearParameters) => {
	const dispatch = useAppDispatch();
	const { selected } = useAppSelector(state => state.gears);

	const [points, setPoints] = useState("");

	const gearRef = useRef<SVGPathElement>(null);
	const wrapperRef = useRef<SVGForeignObjectElement>(null)

	const pixelToCm = 0.026458;
	init().then(() => {
		setPoints(make_gear(props.teethCount, props.pitchDiameter / pixelToCm));
	})
	const containerSize = (props.pitchDiameter + 3 * (props.pitchDiameter / props.teethCount)) / pixelToCm;
	return (
		<>
			<Draggable nodeRef={wrapperRef as any}>
				<foreignObject
					width={containerSize}
					height={containerSize}
					onClick={() => dispatch(setSelected(props.id))}
					ref={wrapperRef}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"

						className="overflow-visible w-fit h-fit rounded-full pointer-events-none"
						width={containerSize}
						height={containerSize}
					>
						<path
							stroke={"black"}
							strokeWidth={1}
							fill={"#000"}
							fillOpacity={selected === props.id ? "0.5" : "0"}
							d={points}
						>
						</path>
					</svg>

					<div
					>
						{props.teethCount + " " + props.pitchDiameter + " " + props.id}
					</div>
				</foreignObject>
			</Draggable>
		</>
	);
};

export default Gear;
import React, { ForwardedRef, forwardRef, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import init, { make_gear, test } from "gear-calc";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { GearParameters, linkGear, setSelected, setSpinSpeed, toggleLinking } from "./app/features/gearsSlice";

const Gear = React.forwardRef<SVGGElement, GearParameters>((props: GearParameters, ref) => {
	const dispatch = useAppDispatch();
	const { gears, selectedId, selectedModule, isLinking, linkedIndices } = useAppSelector(state => state.gears);

	const [points, setPoints] = useState("");
	const [linkedPosition, setLinkedPosition] = useState<{ x: number, y: number } | null>(null);
	const [gearRot, setGearRot] = useState((props.reversed ? 180 / props.teethCount : 0));


	// const pathRef = useRef<SVGPathElement>(null);
	const wrapperRef = useRef<SVGSVGElement>(null);

	const pixelToCm = 0.026458;
	const speed = props.speedRpm === 0 ? 0 : 60 / props.speedRpm;
	const module = props.pitchDiameter / props.teethCount;
	const containerSize = getWidth(props.pitchDiameter, module);


	function lerp(t: number, x0: number, x1: number): number {
		return (1 - t) * x0 + t * x1;
	}
	function yPosAtX(px: number, x0: number, y0: number, x1: number, y1: number) {
		return y0 + (px - x0) * (y1 - y0) / (x1 - x0);
	}

	function getGearPosition(gear: SVGGElement | null) {
		const transformString = gear?.parentElement?.parentElement?.getAttribute("transform") || null;
		const parsedTransform = transformString?.substring(10, transformString.length - 1).split(",").map(e => { return parseFloat(e); });
		return parsedTransform;
	}

	function formatGearPosition(transform: number[] | undefined): { x: number, y: number } | null {
		if (transform) {
			return { x: transform[0], y: transform[1] };
		} else {
			return null;
		}
	}
	function getWidth(pitchDiameter: number, module: number) {
		return (pitchDiameter + 2 * module) / pixelToCm
	}

	useEffect(()=>console.log(gearRot),[gearRot]);


	useEffect(() => {
		if (linkedIndices[1] === props.id) {

			const parentGear = props.gearRefs!.current[linkedIndices[0]];
			const parentPosition = formatGearPosition(getGearPosition(parentGear));
			const parentGearParameters = gears[linkedIndices[0]];
			const parentWidth = getWidth(parentGearParameters.pitchDiameter, module);

			const childGear = props.gearRefs!.current[linkedIndices[1]]!;
			const childPosition = formatGearPosition(getGearPosition(childGear))!;
			const childGearParameters = gears[linkedIndices[1]];
			const childWidth = getWidth(childGearParameters.pitchDiameter, module);
			if (parentPosition !== null && childPosition !== null) {
				const childCenter = { x: childPosition.x + childWidth / 2, y: childPosition.y + childWidth / 2 };
				const parentCenter = { x: parentPosition.x + parentWidth / 2, y: parentPosition.y + parentWidth / 2 };

				const dist = Math.sqrt((parentCenter.x - childCenter.x) ** 2 + (parentCenter.y - childCenter.y) ** 2);
				const targetDist = parentGearParameters.pitchDiameter / (2 * pixelToCm) + childGearParameters.pitchDiameter / (2 * pixelToCm);
				const ratio = targetDist / dist;
				const xPos = lerp(ratio, parentCenter.x, childCenter.x);
				const yPos = yPosAtX(xPos, parentCenter.x, parentCenter.y, childCenter.x, childCenter.y);

				const newChildPosition = { x: xPos - childWidth / 2, y: yPos - childWidth / 2 };
				// setGearRot(e => {
				// 	return e +
				// 		Math.atan((parentCenter.y - yPos) / (xPos - parentCenter.x)) * 180 / Math.PI
				// });
				setLinkedPosition(newChildPosition);
			} else {
				setLinkedPosition(null);
			}
		}

	}, [linkedIndices]);

	init().then(() => {
		setPoints(make_gear(props.teethCount, props.pitchDiameter / pixelToCm));
	});
	return (
		<>
			<Draggable
				onDrag={() => {
					if (linkedPosition !== null) {
						setLinkedPosition(null);
					}
				}}
				position={linkedPosition || undefined}
				nodeRef={wrapperRef as any}
			>
				<foreignObject
					width={containerSize}
					height={containerSize}
				// transform={parentTransform || ""}
				>
					{/* <div className="flex"> */}

					<svg
						xmlns="http://www.w3.org/2000/svg"

						className="overflow-visible w-fit h-fit rounded-full pointer-events-none relat"
						width={containerSize}
						height={containerSize}
						ref={wrapperRef}
					>
						<g
							style={{
								transformBox: "fill-box",
								transformOrigin: "center",
								rotate: gearRot + "deg"
							}}
							ref={ref}
						>
							{/* <rect width={containerSize} height={containerSize} stroke="black" strokeWidth={2} fill="none"></rect> */}
							< path
								stroke={"black"}
								strokeWidth={1}
								fill={`${isLinking ? `${selectedId === props.id ? "black" : "green"}` : "black"}`
								}
								className={"origin-center pointer-events-auto animate-[spin_0s_linear_infinite]"}
								style={{ transformBox: "fill-box", animation: `${speed}s linear 0s infinite ${props.reversed ? "reverse" : "normal"} none running spin` }}
								fillOpacity={(selectedId === props.id || (module === selectedModule && isLinking)) ? "0.5" : "0"}
								d={points}
								onClick={() => {
									dispatch(setSelected(props.id))
									if (isLinking) {
										dispatch(toggleLinking());
										dispatch(linkGear(props.id));
										// setParentTransform(props.gearRefs?.current[linkedIndices[0]]?.getAttribute("transform") || null);
									}
								}}
							>
							</path>
							<g
								style={{
									transformBox: "fill-box",
									transformOrigin: "center",
									rotate: -gearRot + "deg"
								}}
							>
								<text y={containerSize / 2} dominantBaseline="middle" textAnchor="middle">
									<tspan x={containerSize / 2} dy="0rem">
										Module: {module}
									</tspan>
									<tspan x={containerSize / 2} dy="1.1rem">
										Speed: {props.speedRpm} rpm
									</tspan>
									<tspan x={containerSize / 2} dy="1.1rem">
										Pitch Diameter: {props.pitchDiameter}
									</tspan>
									<tspan x={containerSize / 2} dy="1.1rem">
										Tooth Count: {props.teethCount}
									</tspan>
								</text>
							</g>
						</g>
					</svg>
					{/* </div> */}
				</foreignObject>
			</Draggable>
		</>
	);
});

export default Gear;

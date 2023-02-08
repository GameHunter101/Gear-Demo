import React, { ForwardedRef, forwardRef, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import init, { make_gear, test } from "gear-calc";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { setSelected } from "./app/features/gearsSlice";

interface GearProps {
	teethCount: number,
	pitchDiameter: number,
	id: number
}

const Gear = (props: GearProps) => {
	const dispatch = useAppDispatch();
	const {selected} = useAppSelector(state=>state.gears);
	const pixelToCm = 0.026458;
	return (
		<>
			<foreignObject
				width={100}
				height={24}
				style={{translate: `0px ${props.id*24}px`}}
				className={`${selected===props.id?"bg-gray-600":""}`}
				onClick={()=>dispatch(setSelected(props.id))}
			>
				<div>
					{props.teethCount + " " + props.pitchDiameter + " " + props.id}
				</div>
			</foreignObject>
		</>
	);
};

export default Gear;
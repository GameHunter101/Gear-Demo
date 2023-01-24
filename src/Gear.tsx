import React, {useEffect, useState} from "react";
import { ReactSVG } from "react-svg";
import init, {make_gear} from "gear-calc";

interface GearProps {
	teeth: number,
	radius: number,
	position: { x: number, y: number }
}

const Gear = (props: GearProps) => {
	const [points, setPoints] = useState(null);
	useEffect(()=>{
		init().then(()=>{
			console.log(make_gear(9,20));
		})
	})
	let d = "M"
	return (
		<>
		<svg
		viewBox="0 0 500 500" xmlns="<http://www.w3.org/2000/svg>">
			<path strokeWidth={"2"} stroke={"red"} d=""></path>
		</svg>
		{/* <div style={{ translate: props.position.x + props.radius + "px " + props.position.y + "px" }}>
			<div className="absolute translate-y-[-28.25px]">
				{
					(new Array(props.teeth).fill("")).map((_e, i) => {
						console.log(i * (360 / props.teeth));
						let temp = "100deg"
						return (
							<ReactSVG key={i} src="tooth.svg" className={`absolute`} style={{ rotate: `${i * (360 / props.teeth)}deg`, transformOrigin: -1 * props.radius + "px center" }} />
						)
					})
				}
			</div>
			<div className={`bg-black rounded-full absolute`} style={{ width: props.radius + "px", height: props.radius + "px"}}></div>
		</div> */}
		</>
	);
};

export default Gear;
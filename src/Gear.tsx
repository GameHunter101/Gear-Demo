import { ReactSVG } from "react-svg";

interface GearProps {
	teeth: number,
	radius: number,
	position: { x: number, y: number }
}

const Gear = (props: GearProps) => {
	return (
		<div style={{ translate: props.position.x + props.radius + "px " + props.position.y + "px" }}>
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
		</div>
	);
};

export default Gear;
import React from "react";

export default function Dots({ active = 0 }) {
	var color;
	if (active) {
		color = "url(#linear)";
	} else {
		color = "#212121";
	}
	return (
		<div
			className="dot"
			style={{
				boxShadow:
					"-2px -2px 5px rgba(248, 248, 248, 0.08), 2px 2px 5px rgba(0, 0, 0, 0.75)",
				borderRadius: "50%",
				width: "12px",
				height: "12px",
				position: "relative",
			}}
		>
			<defs>
				<linearGradient
					id="linear"
					x1="0%"
					y1="50%"
					x2="100%"
					y2="100%"
				>
					<stop offset="0%" stopColor="#04A0B6" />
					<stop offset="80%" stopColor="#1fddbd" />
				</linearGradient>
			</defs>
			<svg
				viewBox="0 0 12 12"
				style={{
					boxShadow:
						"inset -2px -2px 5px rgba(248, 248, 248, 0.08), inset 2px 2px 5px rgba(0, 0, 0, 0.75)",
					borderRadius: "50%",
					position: "absolute",
					margin: "0",
				}}
			>
				<circle fill={color} cx="50%" cy="50%" r="5" />
			</svg>
		</div>
	);
}

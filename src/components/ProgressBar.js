import React from "react";

function ProgressBar({ percentage, size, stroke }) {
	const center = size / 2;
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = ((100 - percentage) / 100) * circumference;

	return (
		<div
			className="progress"
			style={{
				width: `${size}px`,
				height: `${size}px`,
				minWidth: `${size}px`,
				minHeight: `${size}px`,
				borderRadius: "50%",
				overflow: "hidden",
				boxShadow:
					"inset -4px -4px 10px rgba(248, 248, 248, 0.08), inset 4px 4px 10px rgba(0, 0, 0, 0.75)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				className="interior"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: `calc(${size}px - 2 * ${stroke}px)`,
					width: `calc(${size}px - 2 * ${stroke}px)`,
					borderRadius: "50%",
					boxShadow:
						"-4px -4px 10px rgba(248, 248, 248, 0.08), 4px 4px 10px rgba(0, 0, 0, 0.75)",
					color: "#fff",
					overflow: "hidden",
					zIndex: "2",
				}}
			></div>
			<svg
				width={size}
				height={size}
				style={{ position: "absolute", maskClip: "inherit" }}
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
				<circle
					fill="none"
					cx={center}
					cy={center}
					r={radius}
					stroke="url(#linear)"
					strokeLinecap="round"
					strokeWidth={stroke}
					strokeDasharray={circumference}
					strokeDashoffset={progress}
					style={{
						transform: "rotate(-90deg)",
						transformOrigin: "50% 50%",
					}}
				/>
				<text
					x="50%"
					y="50%"
					textAnchor="middle"
					dominantBaseline="middle"
					fill="url(#linear)"
					style={{
						fontWeight: "bolder",
						fontSize: `calc(calc(${size}px - 2 * ${stroke}px) / 4)`,
					}}
				>
					{percentage}%
				</text>
			</svg>
		</div>
	);
}

export default ProgressBar;

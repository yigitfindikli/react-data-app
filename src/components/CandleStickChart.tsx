import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import "./CandleStickChart.css";

export interface CandlestickData {
	x: string;
	y: [number, number, number, number];
}

export interface CandlestickChartProps {
	seriesData: CandlestickData[];
	darkMode?: boolean;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
	seriesData,
	darkMode
}) => {
	const options: ApexOptions = {
		theme: {
			mode: darkMode ? "dark" : "light"
		},
		chart: {
			type: "candlestick",
			height: 350,
			background: "var(--chart-bg)",
			foreColor: "var(--chart-fore-color)",
			toolbar: {
				tools: {
					zoom: false
				}
			}
		},
		xaxis: {
			type: "datetime",
			labels: {
				style: {
					colors: "var(--chart-fore-color)"
				}
			},

			axisBorder: {
				color: "var(--chart-border-color)"
			},
			axisTicks: {
				color: "var(--chart-border-color)"
			}
		},
		grid: {
			borderColor: "var(--chart-border-color)"
		},
		yaxis: {
			tooltip: {
				enabled: true
			},
			labels: {
				style: {
					colors: "var(--chart-fore-color)"
				}
			}
		}
	};

	const series = [
		{
			data: seriesData
		}
	];

	return (
		<div className="chart">
			<ReactApexChart
				options={options}
				series={series}
				type="candlestick"
				height={350}
			/>
		</div>
	);
};

export default CandlestickChart;

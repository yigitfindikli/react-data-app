import React, { useEffect, useState } from "react";
import Table from "./components/Table";
import CandlestickChart, {
	CandlestickData
} from "./components/CandleStickChart";

interface TimeSeriesEntry {
	"1. open": string;
	"2. high": string;
	"3. low": string;
	"4. close": string;
	"5. volume": string;
}

interface FormattedData {
	timestamp: string;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
}

interface TimeSeriesData {
	[timestamp: string]: TimeSeriesEntry;
}

// For the purpose of this example, the API key is hardcoded.
const API_KEY = "RIBXT3XYLI69PC0Q";

const getApiUrl = (key: string) => {
	return `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${key}`;
};

const getFormattedArray = (data: TimeSeriesData): FormattedData[] => {
	const formattedData: FormattedData[] = Object.keys(data).map(
		(timestamp) => ({
			timestamp,
			open: data[timestamp]["1. open"],
			high: data[timestamp]["2. high"],
			low: data[timestamp]["3. low"],
			close: data[timestamp]["4. close"],
			volume: data[timestamp]["5. volume"]
		})
	);

	return formattedData;
};

const getChartData = (data: FormattedData[]): CandlestickData[] => {
	const chartData: CandlestickData[] = data.map((data) => ({
		x: data.timestamp,
		y: [+data.open, +data.high, +data.low, +data.close]
	}));

	return chartData;
};

const getTimeSeriesData = async (key: string) => {
	const apiUrl = getApiUrl(key);
	const response = await fetch(apiUrl);
	const result = await response.json();
	const timeSeries = result["Time Series (5min)"];

	return timeSeries;
};

const App: React.FC = () => {
	const [data, setData] = useState<FormattedData[]>([]);
	const [chartData, setChartData] = useState<CandlestickData[]>([]);
	const [showChart, setShowChart] = useState<boolean>(true);
	const [scrollable, setScrollable] = useState<boolean>(true);
	const [striped, setStriped] = useState<boolean>(true);
	const [darkMode, setDarkMode] = useState<boolean>(false);

	// The application uses an API key for data fetching, which has a limit of 25 requests per day.
	// If this limit is exceeded, the code automatically falls back to a 'demo' key provided by the API.
	useEffect(() => {
		const fetchData = async () => {
			try {
				const apiUrl = getApiUrl(API_KEY);
				const timeSeries = await getTimeSeriesData(apiUrl);

				if (!timeSeries) {
					throw new Error("Key not found");
				}

				const formattedData = getFormattedArray(timeSeries);
				const formattedChartData: CandlestickData[] =
					getChartData(formattedData);

				setChartData(formattedChartData);
				setData(formattedData);
			} catch (error) {
				try {
					console.warn("Error fetching data, trying 'demo' key");
					const apiUrl = getApiUrl("demo");
					const timeSeries = await getTimeSeriesData(apiUrl);

					if (!timeSeries) {
						console.error("No time series data found");
						return;
					}

					const formattedData = getFormattedArray(timeSeries);
					const formattedChartData: CandlestickData[] =
						getChartData(formattedData);

					setChartData(formattedChartData);
					setData(formattedData);
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			}
		};

		fetchData();
	}, []);

	const columns = [
		{ label: "Timestamp", key: "timestamp" as keyof FormattedData },
		{ label: "Open", key: "open" as keyof FormattedData },
		{ label: "High", key: "high" as keyof FormattedData },
		{ label: "Low", key: "low" as keyof FormattedData },
		{ label: "Close", key: "close" as keyof FormattedData },
		{ label: "Volume", key: "volume" as keyof FormattedData }
	];

	return (
		<div className={`${darkMode ? "dark" : ""}`}>
			<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
				<div className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Time Series Stock Data
						</h1>

						<button
							className="p-2 w-12 rounded-full bg-transparent text-xl text-gray-700 dark:text-gray-200 border dark:border-gray-600 border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 dark:focus-visible:ring-gray-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-0 dark:focus-visible:ring-offset-gray-800  transition-colors duration-150"
							onClick={() => setDarkMode(!darkMode)}
						>
							<i
								className={`text-md fa ${
									darkMode ? "fa-sun" : "fa-moon"
								}`}
							></i>
						</button>
					</div>
					<div className="flex gap-4">
						<button
							className="px-4 py-2 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-0 dark:focus-visible:ring-offset-gray-800 rounded mr-2 transition-colors duration-150"
							onClick={() => setShowChart(!showChart)}
						>
							{showChart ? "Show Table" : "Show Chart"}
						</button>
					</div>
					{showChart ? (
						<div className="mb-4">
							<CandlestickChart seriesData={chartData} />
						</div>
					) : (
						<>
							<div className="mb-4 flex gap-2">
								<button
									className="px-4 py-2 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-0 dark:focus-visible:ring-offset-gray-800 rounded transition-colors duration-150"
									onClick={() => setScrollable(!scrollable)}
								>
									Toggle Scrollable
								</button>
								<button
									className="px-4 py-2 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-0 dark:focus-visible:ring-offset-gray-800 rounded transition-colors duration-150"
									onClick={() => setStriped(!striped)}
								>
									Toggle Striped
								</button>
							</div>
							{data.length > 0 ? (
								<Table
									data={data}
									columns={columns}
									scrollable={scrollable}
									striped={striped}
								/>
							) : (
								<p className="text-gray-900 dark:text-gray-100">
									Loading...
								</p>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default App;

# Time Series Stock Data Viewer

## Overview

This project is a React application that displays stock data using a reusable table component and a candlestick chart. The application fetches data from the Alpha Vantage API and visualizes it in a user-friendly format. It includes features for dark mode, striped rows in the table, and scrollable content for large datasets.

## Features

-   Reusable Table Component: A customizable and reusable table component that supports features like striped rows, scrollability, and custom rendering for cells and headers.
-   Candlestick Chart: Visualization of stock data using candlestick charts with ApexCharts, supporting light and dark modes.
-   Dark Mode Support: Toggle between light and dark modes for better user experience.

## Installation

1. Install the dependencies

```
npm install
```

2. Start!

```
npm start
```

3. Open your browser and navigate to http://localhost:5173 to see the application in action.

## Reusable Table Component

The table component is designed to be highly customizable and reusable. You can define the data, columns, and various attributes to tailor it to your needs.

### Example Usage

```tsx
import Table from "./components/Table";

const data = [
	{
		timestamp: "2024-07-31 19:55:00",
		open: "192.5800",
		high: "192.6200",
		low: "192.2300",
		close: "192.6200",
		volume: "158"
	}
	// ... more data
];

const columns = [
	{ label: "Timestamp", key: "timestamp" },
	{ label: "Open", key: "open" },
	{ label: "High", key: "high" },
	{ label: "Low", key: "low" },
	{ label: "Close", key: "close" },
	{ label: "Volume", key: "volume" }
];

const MyComponent = () => (
	<Table data={data} columns={columns} striped={true} scrollable={true} />
);
```

### Props

-   data: An array of objects representing the table data.
-   columns: An array of column definitions, each containing a label and key.
-   striped: A boolean to toggle striped rows.
-   scrollable: A boolean to enable vertical scrolling.
-   scrollHeight: A string to define the max height of the table when scrollable.

## Handling API Key Limits

The application uses an API key for data fetching, which has a limit of 25 requests per day. If this limit is exceeded, the code automatically falls back to a 'demo' key provided by the API.

## Code Explanation

The useEffect hook fetches the data from the API. If the request using the primary API key fails (due to the limit being reached or any other error), it retries the request using the 'demo' key.

```tsx
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
```

This ensures that the application remains functional even if the primary API key's request limit is reached.

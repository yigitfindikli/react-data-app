import React, {
	ReactNode,
	HTMLAttributes,
	TdHTMLAttributes,
	ThHTMLAttributes
} from "react";

interface Column<T> {
	label: string;
	key: keyof T;
	render?: (value: T[keyof T], data: T) => ReactNode;
	headerRender?: () => ReactNode;
	thAttributes?: ThHTMLAttributes<HTMLTableCellElement>;
	tdAttributes?: TdHTMLAttributes<HTMLTableCellElement>;
}

interface TableProps<T> {
	data: T[];
	columns: Column<T>[];
	striped?: boolean;
	scrollable?: boolean;
	scrollHeight?: string;
	tableAttributes?: HTMLAttributes<HTMLTableElement>;
	theadAttributes?: HTMLAttributes<HTMLTableSectionElement>;
	tbodyAttributes?: HTMLAttributes<HTMLTableSectionElement>;
}

const Table = <T,>({
	data,
	columns,
	striped = false,
	scrollable = false,
	scrollHeight = "300px",
	tableAttributes,
	theadAttributes,
	tbodyAttributes
}: TableProps<T>) => {
	const generateClassName = (
		baseClasses: string,
		conditionalClasses: string | undefined,
		optionalClasses: string | undefined
	) =>
		`${baseClasses} ${conditionalClasses || ""} ${
			optionalClasses || ""
		}`.trim();

	const containerClass = generateClassName(
		"overflow-x-auto",
		scrollable ? "overflow-y-auto" : "",
		undefined
	);

	const tableClass = generateClassName(
		"min-w-full bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200 dark:text-gray-200",
		scrollable ? "" : "border",
		tableAttributes?.className
	);

	const theadClass = generateClassName(
		"",
		undefined,
		theadAttributes?.className
	);

	const tbodyClass = generateClassName(
		"",
		undefined,
		tbodyAttributes?.className
	);

	const renderHeader = (col: Column<T>, index: number) => {
		const thClass = generateClassName(
			"px-4 py-2 shadow-custom text-start bg-white dark:bg-gray-800 box",
			scrollable ? "sticky top-0" : "",
			col.thAttributes?.className
		);

		return (
			<th key={index} {...col.thAttributes} className={thClass}>
				{col.headerRender ? col.headerRender() : col.label}
			</th>
		);
	};

	const renderData = (item: T, col: Column<T>, colIndex: number) => {
		const tdClass = generateClassName(
			"px-4 py-2 border-b dark:border-gray-700",
			undefined,
			col.tdAttributes?.className
		);

		return (
			<td key={colIndex} {...col.tdAttributes} className={tdClass}>
				{col.render
					? col.render(item[col.key], item)
					: (item[col.key] as React.ReactNode)}
			</td>
		);
	};

	return (
		<div
			className={containerClass}
			style={{ maxHeight: scrollable ? scrollHeight : "initial" }}
		>
			<table {...tableAttributes} className={tableClass}>
				<thead {...theadAttributes} className={theadClass}>
					<tr>
						{columns.map((col, index) => renderHeader(col, index))}
					</tr>
				</thead>
				<tbody {...tbodyAttributes} className={tbodyClass}>
					{data.map((item, rowIndex) => {
						const rowClass = generateClassName(
							"",
							striped && rowIndex % 2 === 1
								? "bg-gray-100 dark:bg-gray-700"
								: "",
							undefined
						);

						return (
							<tr key={rowIndex} className={rowClass}>
								{columns.map((col, colIndex) =>
									renderData(item, col, colIndex)
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Table;

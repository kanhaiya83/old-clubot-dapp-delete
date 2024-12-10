import { useEffect, useState } from "react";
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "./ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

const ChatTable = ({
	data = [],
	caption,
}: {
	data: any[];
	caption?: string;
}) => {
	const [columns, setColumns] = useState<string[]>([]);
	useEffect(() => {
		if (data.length) {
			setColumns(Object.keys(data[0]));
		}
	}, [data]);

	return (
		<Table className="w-max my-4">
			{caption && caption.length && <TableCaption>{caption}</TableCaption>}
			<TableHeader>
				<TableRow className="w-fit border">
					{columns.map((column, index) => (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<TableHead
										className={`border-r last:border-none text-xs font-medium truncate !p-2 h-full ${
											columns.length > 7
												? "w-[70px] max-w-[70px]"
												: columns.length > 2
												? "w-[150px] max-w-[150px]"
												: "w-[200px] max-w-[200px]"
										}`}
										key={index}
									>
										{(data[0] as any)[column]?.title}
									</TableHead>
								</TooltipTrigger>
								<TooltipContent>
									{(data[0] as any)[column]?.title}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((val, index) => (
					<TableRow className="!border" key={index}>
						{columns.map((column, index) => (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<TableCell
											className={`border-r text-xs font-normal text-left truncate !p-2 h-full ${
												columns.length > 7
													? "w-[70px] max-w-[70px]"
													: columns.length > 2
													? "w-[150px] max-w-[150px]"
													: "w-[200px] max-w-[200px]"
											}`}
											key={index}
										>
											{(val as any)[column]?.type === "text" ? (
												(val as any)[column]?.content
											) : (val as any)[column]?.type === "url" ? (
												<a
													href={(val as any)[column]?.content}
													className="text-[#1212e1] underline cursor-pointer"
													target="_blank"
													rel="noreferrer"
												>
													Link
												</a>
											) : (val as any)[column]?.type === "image" ? (
												<img
													src={(val as any)[column]?.content}
													alt=""
													className="w-[30px] h-[30px] !pointer-events-none rounded-full"
												/>
											) : (
												(val as any)[column]?.content
											)}
										</TableCell>
									</TooltipTrigger>
									{(val as any)[column]?.type === "image" ? (
										<></>
									) : (
										<TooltipContent>
											{(val as any)[column]?.type === "text" ? (
												(val as any)[column]?.content
											) : (val as any)[column]?.type === "url" ? (
												<a
													href={(val as any)[column]?.content}
													target="_blank"
													rel="noreferrer"
												>
													{(val as any)[column]?.content}
												</a>
											) : (
												(val as any)[column]?.content
											)}
										</TooltipContent>
									)}
								</Tooltip>
							</TooltipProvider>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default ChatTable;

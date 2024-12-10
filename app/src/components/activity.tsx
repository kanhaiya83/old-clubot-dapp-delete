import { useState, useEffect } from "react";
import { CopySVG } from "../atoms/svg-comps/copy";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";
import { fetchData } from "../helper/fetchData";
import { copyToClipboard } from "../lib/utils";
import { BASE_URL } from "../lib/config";
import TokenDetailsContainer from "../atoms/token-details-container";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

const Activity = () => {
	const { chain } = useAccount();
	const [sendHistory, setSendHistory] = useState([]);
	useEffect(() => {
		fetchData(`${BASE_URL}/activity?type=transfer&type=swap`, "GET")
			.then((data) => {
				const res = data.map((tx: any) => ({
					...tx,
					txHash: Array.isArray(tx.txHash) ? tx?.txHash : [tx.txHash],
				}));
				setSendHistory(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<div className="md:m-[6px] md:border  border-[#232323] rounded-[8px] rounded-tr-none mr-0 h-full pt-[16px] px-[8px] md:px-[40px]">
				<div className="flex justify-between w-full">
					<h4 className="text-header mt-0">Activities</h4>
				</div>

				<div className="!table-bg rounded-[10px] mt-4 hidden md:block">
					<Table>
						<TableHeader>
							<TableRow className="!border-border/50 pb-2">
								<TableHead className="w-[100px] px-3 py-5 text-left">
									Index
								</TableHead>
								<TableHead className="px-3 py-5 text-left">
									Description
								</TableHead>
								<TableHead className="px-3 py-5 text-center">Hash</TableHead>
								<TableHead className="px-3 py-5 text-right">Type</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sendHistory && sendHistory.length ? (
								sendHistory.map((tx: any, index) => (
									<TableRow key={index} className="border-0">
										<TableCell className="font-medium w-[100px] px-3 py-4">
											{index + 1}
										</TableCell>
										<TableCell>
											{tx.type === "transfer" ? (
												`Sent ${tx.amount} ${tx.tokenName} ≈ ${(
													tx?.valueInUSD ?? 0
												).toFixed(6)}  to ${
													tx.to
														? `${tx.to?.slice(0, 4)}...${tx.to?.slice(-4)} `
														: "~"
												}`
											) : (
												<>
													{/* `Swapped ${tx.amount}${tx.tokenName} ≈ ${(tx?.valueInUSD ?? 0).toFixed(6)}  to ${tx.to}` */}
													<div className="flex flex items-center truncate">
														Swapped &nbsp;{" "}
														{tx?.tokenAAddress ? (
															<Link
																to={`${chain?.blockExplorers?.default.url}/token/${tx?.tokenAAddress}`}
																target="blank"
																className="text-[#ffffff] hover:text-[#1212e1] font-medium text-sm"
															>
																{tx?.tokenAName}
															</Link>
														) : (
															<span className="text-[#a7a7a7] font-medium text-xs">
																{tx?.tokenAName}
															</span>
														)}
														<span className="text-[#a7a7a7] font-medium text-xs">
															(≈ {(tx?.amountA ?? 0).toFixed(2)})
														</span>
														<span className="text-[#ffffff] font-medium text-xs">
															&nbsp;to&nbsp;
														</span>
														{tx?.tokenBAddress ? (
															<Link
																to={`${chain?.blockExplorers?.default.url}/token/${tx?.tokenBAddress}`}
																target="blank"
																className="text-[#ffffff] hover:text-[#1212e1] font-medium text-sm"
															>
																{tx?.tokenBName}
															</Link>
														) : (
															<span className="text-[#a7a7a7] font-medium text-xs">
																{tx?.tokenBName}
															</span>
														)}
														<span className="text-[#a7a7a7] font-medium text-xs">
															(≈ {(tx?.amountB ?? 0).toFixed(2)})
														</span>
														{/* <span className="text-[#656565] text-xs">{tx.symbol}</span> */}
													</div>
												</>
											)}
										</TableCell>
										<TableCell>
											{tx?.txHash && tx.txHash.length ? (
												tx?.txHash.map((hash: string) => (
													<div
														key={hash}
														className="flex justify-center items-center gap-x-2 text-[#a7a7a7] text-sm font-medium"
													>
														{hash
															? `${hash?.slice(0, 4)}...${hash?.slice(-4)} `
															: "~"}
														<CopySVG
															className="text-[#493844] cursor-pointer active:scale-90 "
															onClick={() => copyToClipboard(hash)}
														/>
													</div>
												))
											) : (
												<span className="text-[#a7a7a7] text-xs">~</span>
											)}
										</TableCell>
										<TableCell>
											<Badge className="text-white uppercase !w-fit !min-w-[50px] !px-2">
												{tx.type}
											</Badge>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className="text-center">
										<p className="text-[#a7a7a7] text-base py-6 text-center">
											No Recent Activities
										</p>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				<div className="flex flex-col md:hidden mt-[16px] gap-y-[16px]">
					{sendHistory &&
						sendHistory.map((tx: any, index) => (
							<TokenDetailsContainer key={index} tx={tx} type="activity" />
						))}
				</div>
			</div>
		</section>
	);
};

export default Activity;

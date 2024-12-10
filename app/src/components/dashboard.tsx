import { SendSVG } from "../atoms/svg-comps/send";
import { CopySVG } from "../atoms/svg-comps/copy";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useContext, useEffect, useState } from "react";
import { MyStore } from "../helper/MyStore";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { fetchData } from "../helper/fetchData";
import { Button } from "./ui/button";
import { copyToClipboard } from "../lib/utils";
import { BASE_URL } from "../lib/config";
import TokenDetailsContainer from "../atoms/token-details-container";
import { Badge } from "./ui/badge";

const Dashboard = () => {
	const { address, chain } = useAccount();
	const [sendHistory, setSendHistory] = useState([]);
	const [tokenBalance, setTokenBalance] = useState([] as any[]);
	const [totalBalance, setTotalBalance] = useState(0);
	const { selectedChain, balances } = useContext(MyStore);

	useEffect(() => {
		fetchData(`${BASE_URL}/activity?type=transfer&type=swap&limit=5`, "GET")
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

	useEffect(() => {
		if (tokenBalance) {
			let total = 0;
			tokenBalance.forEach((token: any) => {
				total += token.amount * token.price;
			});
			setTotalBalance(total);
		}
	}, [tokenBalance]);

	useEffect(() => {
		if (balances) {
			const tokensList =
				balances && balances?.length
					? balances.filter((token: any) => token.amount > 0 && token.price > 0)
					: [];
			setTokenBalance(tokensList);
		}
	}, [balances]);

	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<div className="md:m-[6px] md:border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px] px-[6px] md:px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<h4 className="text-header pl-[10px] text-white mt-0">Overview</h4>
				<div className="overview overflow-hidden h-auto cluster-card-1 !p-0 rounded-[20px] mt-[20px] flex flex-col w-full">
					<div className="flex flex-col md:flex-row min-h-[224px] w-full">
						<div className="w-full flex-col md:flex-row md:w-[60%] lg:w-[70%] xl:w-[60%] px-4 py-8 min-w-[300px] grow flex items-center shrink-0">
							<div className="min-w-[100px] flex-center w-1/3 relative walletImg">
								<img
									src="./wallet.png"
									alt="wallet"
									className="w-3/4 lg:w-1/2 h-auto shrink"
								/>
							</div>
							<div className="flex flex-col justify-center items-center gap-y-[16px] grow w-2/3">
								<div className="flex-center  gap-x-[8px]">
									{selectedChain.logo_url ? (
										<img src={selectedChain.logo_url} alt="logo" width={30} />
									) : (
										<img src="./etherium.png" alt="Ethereum" width={36} />
									)}
									<span className="text-[#a7a7a7] text-sm truncate max-w-[170px]">
										{address}
									</span>
									<CopySVG
										className="text-[#493844] cursor-pointer active:scale-90"
										onClick={() => copyToClipboard(address || "")}
									/>
								</div>
								<div
									className="w-full h-[1px]"
									style={{
										backgroundImage:
											"linear-gradient(to right, #000 0%, #639 57%, #000)",
									}}
								></div>
								<div className="flex flex-col w-full justify-center items-center gap-y-[6px] grow shrink-0 md:w-1/3">
									<span className="text-[#a7a7a7] text-sm">
										Current Wallet Balance
									</span>
									<span className="text-[26px] font-semibold">
										${(totalBalance ?? 0).toFixed(2)}
									</span>
								</div>
							</div>
						</div>
						<div className="table-bg py-6 h-auto border-0 w-full md:w-[40%] flex-center flex-col justify-center gap-y-[30px]">
							<Link to="/send">
								<Button variant="outline" size="default">
									<SendSVG className="text-white rotate-[-90deg] w-[24px] h-[24px]" />
									<span className="text-base font-medium">Send</span>
								</Button>
							</Link>
							<Link
								to="/receive"
								className="btn-gradient-style w-fit min-w-[150px] lg:min-w-[180px]"
							>
								<SendSVG className="text-white rotate-90 w-[24px] h-[24px]" />
								<span className="text-base font-medium">Receive</span>
							</Link>
						</div>
					</div>
					<div className="bg-background grow flex flex-col px-[40px] py-[20px]">
						<div className="flex justify-between text-[#a7a7a7] text-sm pb-[15px] border-b border-border/80 mb-[15px]">
							<span>Token</span>
							<span>Value</span>
						</div>
						{tokenBalance.length ? (
							tokenBalance.map((token, index) => (
								<div key={index} className="flex justify-between py-3">
									<div className="text-base flex justify-start items-center text-[#a7a7a7] truncate">
										<span className="text-sm text-[#a7a7a7] mr-[10px]">
											{index + 1}
										</span>
										<div className="flex items-start ml-4">
											<img
												src={token.logo_url}
												alt=""
												className="w-[25px] mr-1 bg-white rounded-full h-[25px] object-scale-down"
											/>
											<div className="flex items-start">
												<span className="text-[#a7a7a7] font-medium text-base ml-2">
													{token.name}
												</span>
												<span className="text-[#656565] text-base ml-1">
													({token.symbol})
												</span>
											</div>
										</div>
									</div>
									<span className="text-lg text-white">
										{token.amount} {token.symbol} ≈ $
										{(token.amount * token.price).toFixed(2)}
									</span>
								</div>
							))
						) : (
							<p className="text-[#a7a7a7] text-base py-6 text-center">
								No Tokens Found
							</p>
						)}
					</div>
				</div>
				<div className="text-header flex justify-between w-full items-center !mt-8">
					Recent Activities
					<Link to="/activity" className="flex justify-end items-center">
						<span className="text-[#a7a7a7] text-sm mr-2">View All</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="28"
							height="28"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z"
							/>
						</svg>
					</Link>
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
													<div className="flex items-center truncate">
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
													</div>
												</>
											)}
										</TableCell>
										<TableCell>
											{tx?.txHash && tx.txHash.length ? (
												tx?.txHash?.map((hash: string) => (
													<div
														key={hash}
														className="flex flex-wrap justify-center items-center gap-x-2 text-[#a7a7a7] text-sm font-medium"
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

export default Dashboard;

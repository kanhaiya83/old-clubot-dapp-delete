import { useContext, useEffect, useState } from "react";
import { SwapSVG } from "../atoms/svg-comps/swap";
import SelectTokens from "./select-tokens";
import { Link, useLocation } from "react-router-dom";
import { MyStore } from "../helper/MyStore";
import { useGasPrice, useQuote } from "../hooks/swap";
import {
	useAccount,
	useBalance,
	useReadContract,
	useSendTransaction,
	useWriteContract,
	useWaitForTransactionReceipt,
} from "wagmi";
import { ERC20_ABI, W_ERC20_ABI } from "../utils/contracts";
import { fetchData } from "../helper/fetchData";
import { BASE_URL } from "../lib/config";
import { CopySVG } from "../atoms/svg-comps/copy";
import { copyToClipboard } from "../lib/utils";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { SendSVG } from "../atoms/svg-comps/send-rounded";
import SendRecieveSwapTab from "../atoms/send-recieve-swap-tab";
import TokenDetailsContainer from "../atoms/token-details-container";
const SwapPage = () => {
	const { address, chain } = useAccount();
	const [sendAmount, setSendAmount] = useState("0");
	const [sendHistory, setSendHistory] = useState([] as any[]);
	const [isSwapping, setIsSwapping] = useState(false);
	const [hashesList, setHashesList] = useState([] as string[]);
	const [swapParam, setSwapParam] = useState({
		tokenAName: "",
		tokenBName: "",
		tokenAAddress: "",
		tokenBAddress: "",
		amountA: 0,
		amountB: 0,
		txHash: [] as string[],
		valueAinUSD: 0,
		valueBinUSD: 0,
	});

	const {
		data: sendHash,
		isPending: isSendHashPending,
		sendTransactionAsync,
	} = useSendTransaction();
	const {
		data: hash,
		writeContractAsync,
		reset,
		isPending: isWritePending,
	} = useWriteContract();
	const [writeResult, setWriteResult] = useState<{
		type: string;
		data: any;
		withdrawData?: any;
		depositData?: any;
	}>({ type: "", data: {}, withdrawData: {}, depositData: {} });

	const {
		isFetching: isSendFetching,
		isSuccess: isSendSuccess,
		error: sendError,
	} = useWaitForTransactionReceipt({
		hash: sendHash,
	});
	const {
		isFetching: isWriteTxFetching,
		isSuccess: isWriteTxSuccess,
		error: writeTxError,
	} = useWaitForTransactionReceipt({
		hash: hash,
	});

	const {
		sendToken,
		receiveToken,
		setReceiveToken,
		setSendToken,
		selectedChain,
	} = useContext(MyStore);

	const { gasPrice } = useGasPrice(
		sendToken?.name && receiveToken?.name ? selectedChain.community_id : 0
	);

	const isNativeToken = () => {
		return !/^(0x)?[0-9a-f]{40}$/i.test(sendToken?.id) && !sendToken?.address;
	};
	const isToNativeToken = (): boolean => {
		return (
			!/^(0x)?[0-9a-f]{40}$/i.test(receiveToken?.id) && !receiveToken?.address
		);
	};

	const isNativePair = (): boolean => {
		const receiveTokenAddress = (
			receiveToken?.address ??
			receiveToken?.id ??
			""
		).toLowerCase();
		const sendTokenAddress = (
			sendToken?.address ??
			sendToken?.id ??
			""
		).toLowerCase();
		return (
			(sendTokenAddress === selectedChain?.id &&
				receiveTokenAddress === selectedChain?.wrapped_token_id) ||
			(receiveTokenAddress === selectedChain?.id &&
				sendTokenAddress === selectedChain?.wrapped_token_id)
		);
	};

	useEffect(() => {
		fetchData(`${BASE_URL}/activity?type=swap`, "GET")
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
		if (!isSendFetching && isSwapping) {
			if (isSendSuccess) {
				if (writeResult.type === "initiated" || writeResult.type === "") {
					setIsSwapping(false);
					setHashesList([]);
					toast("Transaction Sent", {
						description: "Transaction sent successfully",
						className: "!bg-green-700",
					});

					const temp = {
						...swapParam,
						txHash: hashesList,
					};
					setSwapParam(temp);

					fetchData(`${BASE_URL}/activity/swap`, "POST", temp)
						.then((data) => {
							// Update the existing value
							setSendHistory((prev) => [data, ...prev]);
							toast("Successful Transaction", {
								className: "!bg-green-700",
								description: "Your swap transaction was successful",
							});
						})
						.catch(() => {
							toast("Successful Transaction", {
								className: "!bg-green-700",
								description:
									"Your swap transaction was successful but not recorded in the database",
							});
						})
						.finally(() => {
							reset();
						});
				}
			} else if (sendError) {
				const message = sendError.message.split("\n")[0];
				setIsSwapping(false);
				setHashesList([]);
				toast("Transaction Failed", {
					description: message,
					className: "!bg-red-700",
				});
			}
		}
	}, [isSendFetching, isSendSuccess, sendError, isSwapping]);

	useEffect(() => {
		if (!isWriteTxFetching && isSwapping) {
			if (isWriteTxSuccess) {
				if (writeResult.type === "initiated" || writeResult.type === "") {
					toast("Transaction Sent", {
						description: "Transaction sent successfully",
						className: "!bg-green-700",
					});
					setIsSwapping(false);
					const temp = {
						...swapParam,
						txHash: hashesList,
					};
					setSwapParam(temp);

					fetchData(`${BASE_URL}/activity/swap`, "POST", temp)
						.then((data) => {
							setHashesList([]);
							// Update the existing value
							setSendHistory((prev) => [data, ...prev]);
							toast("Successful Transaction", {
								className: "!bg-green-700",
								description: "Your swap transaction was successful",
							});
						})
						.catch(() => {
							setHashesList([]);
							toast("Successful Transaction", {
								className: "!bg-green-700",
								description:
									"Your swap transaction was successful but not recorded in the database",
							});
						})
						.finally(() => {
							reset();
						});
				}
			} else if (writeTxError) {
				const message = writeTxError.message.split("\n")[0];
				setIsSwapping(false);
				setHashesList([]);
				toast("Transaction Failed", {
					description: message,
					className: "!bg-red-700",
				});
			}
		}
	}, [isWriteTxFetching, isWriteTxSuccess, writeTxError, isSwapping]);

	const { quote } = useQuote({
		account: (() => address ?? "0x00000")(),
		amount: parseFloat((() => sendAmount)()),
		chainId: (() => selectedChain.community_id)(),
		gasPrice: gasPrice?.standard,
		inTokenAddress: (() =>
			isNativeToken()
				? selectedChain.wrapped_token_id ?? ""
				: sendToken?.address
				? sendToken?.address
				: sendToken?.id)(),
		outTokenAddress: (() =>
			receiveToken?.address ? receiveToken?.address : receiveToken?.id ?? "")(),
		slippage: 3,
	});

	useEffect(() => {
		if (quote && writeResult && writeResult.type.length) {
			if (isWriteTxSuccess && writeResult.type === "sendTransaction") {
				sendTransactionAsync(writeResult.data);
				if (isToNativeToken()) {
					setWriteResult({
						...writeResult,
						type: "withdraw",
					});
				} else {
					setWriteResult({
						type: "",
						data: {},
						withdrawData: {},
					});
					reset();
				}
			}
			if (
				isSendSuccess &&
				writeResult.type === "withdraw" &&
				writeResult.withdrawData
			) {
				console.log("Withdrawn from wrapped token");
				writeContractAsync(writeResult.withdrawData);
				setWriteResult({
					type: "",
					data: {},
					withdrawData: {},
				});
				reset();
			}
			if (
				(isWriteTxSuccess || isSendSuccess) &&
				writeResult.type === "deposit" &&
				writeResult.depositData
			) {
				console.log("Deposited to wrapped token");
				writeContractAsync(writeResult.depositData);
				setWriteResult({
					...writeResult,
					type: "sendTransaction",
				});
			}
		}
	}, [
		writeResult,
		isSendSuccess,
		quote,
		isWriteTxSuccess,
		isWriteTxFetching,
		writeTxError,
		isToNativeToken,
		sendTransactionAsync,
		writeContractAsync,
		reset,
	]);

	useEffect(() => {
		if (sendHash) {
			setHashesList((prevHashesList: any) => [...prevHashesList, sendHash]);
			toast.success("Transaction initiated successfully!", {
				className: "!bg-[#5BB8DA]",
			});
		}
	}, [sendHash]);

	useEffect(() => {
		if (hash) {
			setHashesList((prevHashesList: any) => [...prevHashesList, hash]);
			toast.success("Transaction initiated successfully!", {
				className: "!bg-[#5BB8DA]",
			});
		}
	}, [hash]);

	const submit = async () => {
		// Check if native currency and wrapped token are selected as pair
		if (
			sendToken?.id === selectedChain?.id &&
			receiveToken?.id === selectedChain?.wrapped_token_id
		)
			if (!sendToken || !receiveToken) {
				// Check if tokens are selected
				toast("Invalid selection", {
					description: `Please select tokens to swap`,
					className: "!bg-red-700",
				});
				return;
			}
		// Check if balance is there
		if (sendToken) {
			if (parseFloat(sendAmount) > sendToken?.amount) {
				toast("Insufficient balance", {
					description: `You have insufficient balance in your wallet to perform this transaction.`,
					className: "!bg-red-700",
				});
				return;
			}
		}
		// Check if amount is greater than 0
		if (parseFloat(sendAmount) <= 0) {
			toast("Invalid amount", {
				description: `Amount should be greater than 0`,
				className: "!bg-red-700",
			});
			return;
		}
		setIsSwapping(true);
		console.log("🚀 ~ submit ~ isNativePair():", isNativePair());
		if (quote || isNativePair()) {
			setWriteResult({
				type: "initiated",
				data: {},
				withdrawData: {},
				depositData: {},
			});
			setSwapParam({
				tokenAName: sendToken.name,
				tokenBName: receiveToken.name,
				tokenAAddress: sendToken.id,
				tokenBAddress: receiveToken.id,
				amountA: parseFloat(sendAmount),
				amountB:
					(quote?.outAmount ? Number(quote?.outAmount) : 0) /
					10 ** receiveToken.decimals,
				txHash: [],
				valueAinUSD: sendToken.price,
				valueBinUSD: receiveToken.price,
			});
			if (isNativePair()) {
				// Directly deposit to wrapped token
				try {
					const toAmount = Number(sendAmount) * 10 ** sendToken.decimals;

					if (isToNativeToken()) {
						console.log("Withdraw from wrapped token");
						// Withdraw from the wrapped token
						await writeContractAsync({
							address: selectedChain.wrapped_token_id,
							abi: W_ERC20_ABI,
							functionName: "withdraw",
							args: [BigInt(toAmount)],
						});
					} else {
						// Deposit to the wrapped token
						await writeContractAsync({
							address: selectedChain.wrapped_token_id,
							abi: W_ERC20_ABI,
							functionName: "deposit",
							value: BigInt(toAmount),
						});
					}
				} catch (error) {
					console.log("🚀 ~ submit ~ error:", error);
					setIsSwapping(false);
					setHashesList([]);
					return;
				}
			} else {
				const {
					data,
					gasPrice,
					estimatedGas,
					to,
					inToken,
					inAmount,
					outAmount,
				} = quote as any;
				if (isNativeToken()) {
					try {
						await writeContractAsync({
							address: selectedChain.wrapped_token_id,
							abi: ERC20_ABI,
							functionName: "approve",
							args: [to, inAmount],
						});

						setWriteResult({
							type: "deposit",
							depositData: {
								address: selectedChain.wrapped_token_id,
								abi: W_ERC20_ABI,
								functionName: "deposit",
								value: BigInt(inAmount),
							},
							data: {
								account: address,
								to,
								data,
								gasPrice,
								gas: estimatedGas,
							},
						});
						return;
					} catch (error) {
						setIsSwapping(false);
						setHashesList([]);
						return;
					}
				} else {
					try {
						await writeContractAsync({
							address: inToken?.address,
							abi: ERC20_ABI,
							functionName: "approve",
							args: [to, inAmount],
						});
						if (isToNativeToken()) {
							setWriteResult({
								type: "sendTransaction",
								withdrawData: {
									address: selectedChain.wrapped_token_id,
									abi: W_ERC20_ABI,
									functionName: "withdraw",
									args: [outAmount],
								},
								data: {
									account: address,
									to,
									data,
									gasPrice,
									gas: estimatedGas,
								},
							});
						} else {
							setWriteResult({
								type: "sendTransaction",
								data: {
									account: address,
									to,
									data,
									gasPrice,
									gas: estimatedGas,
								},
							});
						}
					} catch (error) {
						console.log("🚀 ~ submit ~ error:", error);
						setIsSwapping(false);
						setHashesList([]);
					}
				}
				console.log("Transaction sent");
			}
		} else {
			toast("Something went wrong", {
				description: "Check if your inputs are correct",
				className: "!bg-red-700",
			});
			setIsSwapping(false);
			setHashesList([]);
		}
	};

	const location = useLocation();

	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<SendRecieveSwapTab activeLink={location.pathname} />
			<div className="md:m-[6px] md:border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px] px-[8px] md:px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<h4 className="text-header mt-0">Swap Tokens</h4>
				<div className="py-[20px] px-[10px] md:px-[40px] cluster-card-1 rounded-[20px] mt-[20px] flex flex-col items-center justify-between">
					<div className="flex flex-col lg:flex-row justify-center items-center gap-x-[10px] grow w-full">
						<div className="grow w-full lg:w-[40%] xl:w-[45%] max-w-[350px] shrink-0">
							<Details
								isSender={true}
								heading="From"
								amount={(() => sendAmount)()}
								onInputChange={(val) => setSendAmount(val)}
								selectedToken={(() => sendToken)()}
								isNativeToken={isNativeToken()}
								isNativePair={isNativePair()}
							/>
							<SelectTokens type="send" headline="Select Chain" />
						</div>

						<button
							onClick={() => {
								const temp = sendToken;
								setSendAmount("0");
								setSendToken(receiveToken);
								setReceiveToken(temp);
							}}
							className="w-16 h-16 btn-gradient-style min-w-16 rounded-full my-[20px] flex-center mx-10"
						>
							<SwapSVG className="text-white" />
						</button>
						<div className="grow w-full lg:mt-0 lg:w-[40%] xl:w-[45%] max-w-[350px] shrink-0">
							<Details
								isSender={false}
								heading="To"
								showMax={false}
								amount={isNativePair() ? sendAmount : "0"}
								selectedToken={receiveToken}
								isNativePair={isNativePair()}
								isNativeToken={isToNativeToken()}
								outAmount={
									quote?.outAmount && quote?.outToken.decimals
										? Number(
												(
													Number(quote?.outAmount) /
													10 ** quote?.outToken.decimals
												).toFixed(6)
										  )
										: 0
								}
							/>
							<SelectTokens type="receive" headline="Select Token" />
						</div>
					</div>
					<button
						disabled={
							isSendHashPending ||
							isWriteTxFetching ||
							isSendFetching ||
							isWritePending ||
							!sendToken ||
							!receiveToken ||
							!sendAmount ||
							Number(sendAmount) <= 0
						}
						onClick={submit}
						className="btn-gradient-style w-fit min-w-[180px] mt-10"
					>
						<SendSVG className="text-white rotate-[-90deg] w-[24px] h-[24px]" />
						<span className="text-base font-medium ">
							{isSendHashPending ||
							isWriteTxFetching ||
							isSendFetching ||
							isWritePending
								? "Swaping..."
								: "Swap Tokens"}
						</span>
					</button>
				</div>
				<div className="text-header flex justify-between w-full items-center !mt-8">
					Recent Swaps
					<Link to="/activity" className="flex justify-end items-center">
						<span className="text-[#a7a7a7] text-sm mr-2">All Activities</span>
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
				<div className="!table-bg rounded-[10px] mt-4 p-3 hidden md:block">
					<Table>
						<TableHeader>
							<TableRow className="!border-border/50 pb-2">
								<TableHead className="w-[100px] p-5">Index</TableHead>
								<TableHead className="p-5 text-left">Details</TableHead>
								<TableHead className="p-5 text-center">Hash</TableHead>
								{/* <TableHead className="text-right p-5">Amount</TableHead> */}
							</TableRow>
						</TableHeader>
						<TableBody>
							{sendHistory && sendHistory.length ? (
								sendHistory.map((tx: any, index) => (
									<TableRow key={index} className="border-0">
										<TableCell className="font-medium w-[100px] p-3">
											{index + 1}
										</TableCell>
										<TableCell>
											<div className="flex gap-x-[5px]">
												<div className="flex flex items-center !truncate">
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
														(≈ {(tx?.amountA ?? 0).toFixed(2)})&nbsp;-&nbsp;
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
											</div>
										</TableCell>
										<TableCell>
											{tx?.txHash && tx?.txHash.length ? (
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
												<span className="text-[#a7a7a7] text-xs w-full text-center">
													~
												</span>
											)}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className="text-center">
										<p className="text-[#a7a7a7] text-base py-6 text-center">
											No Recent Swap Transactions
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
							<TokenDetailsContainer key={index} tx={tx} type="swap" />
						))}
				</div>
			</div>
		</section>
	);
};

const Details = ({
	heading,
	showMax = true,
	isSender = true,
	amount,
	isNativeToken,
	selectedToken,
	outAmount,
	onInputChange,
	isNativePair,
}: {
	heading: string;
	showMax?: boolean;
	isSender?: boolean;
	selectedToken?: any;
	isNativeToken?: boolean;
	amount?: string;
	outAmount?: number;
	isNativePair?: boolean;
	onInputChange?: (value: string) => void;
}) => {
	const { address } = useAccount();
	const { data: nativeBalance } = useBalance({ address });
	// Call your hook at the top level of your component
	const { data: balanceData } = useReadContract({
		address: selectedToken?.address
			? selectedToken?.address
			: selectedToken?.id ?? "",
		abi: ERC20_ABI,
		functionName: "balanceOf",
		args: [address as `0x${string}`],
	});

	return (
		<div className="flex flex-col">
			<span className="text-center text-base font-semibold">{heading}</span>
			<div
				className="block w-full h-[1px] my-[16px]"
				style={{
					backgroundImage: "linear-gradient(to right, #000 0%, #639 60%, #000)",
				}}
			></div>
			<div className="flex justify-between mb-4">
				<div className="flex flex-col gap-y-[16px]">
					<span className="text-sm text-[#a7a7a7]">Amount</span>
					{isSender ? (
						<input
							value={amount}
							onChange={(val) =>
								onInputChange && onInputChange(val.target.value)
							}
							className="text-sm text-center font-semibold h-10 w-28 outline-none overflow-hidden border border-border bg-black rounded-[5px] p-2"
						/>
					) : (
						<div className="text-sm text-center font-semibold h-10 w-28 outline-none overflow-hidden border border-border bg-black rounded-[5px] p-2">
							{isNativePair ? amount : outAmount ?? 0}
						</div>
					)}
					<div className="text-xs font-light -mt-2 w-full flex justify-end">
						{selectedToken?.symbol}
					</div>
				</div>
				<div className="flex flex-col gap-y-[16px] items-end">
					<div className="flex text-sm text-[#a7a7a7]">
						Balance
						{selectedToken &&
							showMax &&
							(Number(balanceData) / 10 ** selectedToken.decimals).toFixed(
								6
							) !== amount && (
								<Badge
									onClick={() => {
										if (balanceData) {
											const val = (
												Number(balanceData) /
												10 ** selectedToken.decimals
											).toFixed(6);
											onInputChange && onInputChange(val);
										} else if (isNativeToken) {
											const val = Number(nativeBalance?.formatted).toFixed(6);
											onInputChange && onInputChange(val);
										}
									}}
									className="btn-gradient-style !w-fit !min-w-[50px] !px-2 ml-2"
								>
									Max
								</Badge>
							)}
					</div>
					<div className="text-sm text-center font-semibold h-10 w-28 outline-none overflow-hidden border border-border bg-black rounded-[5px] p-2">
						{(() => {
							if (!selectedToken) return 0;
							if (isNativeToken) {
								return Number(nativeBalance?.formatted).toFixed(6);
							} else
								return balanceData
									? (
											Number(balanceData) /
											10 ** selectedToken.decimals
									  ).toFixed(6)
									: 0;
						})()}{" "}
					</div>
					<span className="text-xs font-light -mt-2">
						{selectedToken?.symbol}
					</span>
				</div>
			</div>
		</div>
	);
};

export default SwapPage;

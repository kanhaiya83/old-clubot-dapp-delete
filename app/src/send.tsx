import { useCallback, useContext, useEffect, useState } from "react";
import CustomInput from "./components/customInput";
import SelectTokens from "./components/select-tokens";
import { MyStore } from "./helper/MyStore";
import {
	useAccount,
	useBalance,
	useReadContract,
	useSendTransaction,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import { ERC20_ABI } from "./utils/contracts";
import { toast } from "sonner";
import { Badge } from "./components/ui/badge";
import { fetchData } from "./helper/fetchData";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./components/ui/table";
import { CopySVG } from "./atoms/svg-comps/copy";
import { SendSVG } from "./atoms/svg-comps/send-rounded";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "./lib/config";
import { copyToClipboard } from "./lib/utils";
import SendRecieveSwapTab from "./atoms/send-recieve-swap-tab";
import TokenDetailsContainer from "./atoms/token-details-container";

const SendPage = () => {
	const [sendHistory, setSendHistory] = useState([] as any[]);
	const [sendAmount, setSendAmount] = useState("");
	const [sendAddress, setSendAddress] = useState("");
	const [isSendToken, setIsSendToken] = useState(false);
	const { sendToken } = useContext(MyStore);
	const { address, chain } = useAccount();
	const { data: nativeBalance } = useBalance({ address });
	// Call your hook at the top level of your component
	const { data: balanceData } = useReadContract({
		address: sendToken?.address
			? sendToken?.address
			: sendToken?.id
			? sendToken?.id
			: "",
		abi: ERC20_ABI,
		functionName: "balanceOf",
		args: [address as `0x${string}`],
	});

	// Get the balance of the native token
	const {
		data: hash,
		isPending,
		writeContract,
		reset,
		error,
	} = useWriteContract();
	const {
		sendTransactionAsync,
		data: sendHash,
		isPending: isSendHashPending,
		reset: resetSendHash,
		error: sendError,
	} = useSendTransaction();

	const isNativeToken = useCallback(() => {
		return !/^(0x)?[0-9a-f]{40}$/i.test(sendToken?.id) && !sendToken?.address;
	}, [sendToken]);
	function sendTokenCall() {
		// Check if token is selected
		if (!sendToken) {
			toast("Select Token", {
				className: "!bg-red-700",
				description: "Please select a token to send!!!",
			});
			return;
		}
		// Check if amount is entered
		if (!sendAmount) {
			toast("Enter Amount", {
				className: "!bg-red-700",
				description: "Please enter the amount of token to send!!!",
			});
			return;
		}

		//Check Balance
		const sendAmountValue =
			Number(sendAmount) *
			10 **
				(isNativeToken()
					? chain?.nativeCurrency.decimals
					: sendToken?.decimals);
		if (Number(balanceData) < sendAmountValue) {
			toast("Insufficient Balance", {
				className: "!bg-red-700",
				description: "You do not have enough balance to send!!!",
			});
			return;
		}
		// Check if the address is a valid address
		const isAddress = /^(0x)?[0-9a-f]{40}$/i.test(sendAddress);
		if (!isAddress) {
			toast("Invalid Address", {
				className: "!bg-red-700",
				description: "Please enter a valid address!!!",
			});
			return;
		}
		setIsSendToken(true);
		if (isNativeToken()) {
			sendTransactionAsync({
				to: sendAddress as `0x${string}`,
				value: BigInt(sendAmountValue),
			});
		} else {
			writeContract({
				address: sendToken?.address
					? (sendToken?.address as `0x${string}`)
					: (sendToken?.id as `0x${string}`),
				abi: ERC20_ABI,
				functionName: "transfer",
				args: [sendAddress as `0x${string}`, BigInt(sendAmountValue)],
			});
		}
	}
	const { isPending: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash: (isNativeToken() && sendHash) || hash,
		});

	useEffect(() => {
		if (error) {
			// Get only the first line of the error message
			const message = error.message.split("\n")[0];
			toast("Transaction Failed", {
				description: message,
				className: "bg-red-700",
			});
		}
	}, [error]);
	useEffect(() => {
		if (sendError) {
			// Get only the first line of the error message
			const message = sendError.message.split("\n")[0];
			toast("Transaction Failed", {
				description: message,
				className: "bg-red-700",
			});
		}
	}, [sendError]);

	useEffect(() => {
		fetchData(`${BASE_URL}/activity?type=transfer`, "GET")
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
		if (isConfirmed) {
			const body = {
				tokenName: sendToken?.name,
				tokenAddress: sendToken?.address ?? sendToken?.id,
				to: sendAddress,
				amount: sendAmount,
				txHash: [hash],
				valueInUSD: Number(sendAmount) * sendToken?.price,
			};
			fetchData(`${BASE_URL}/activity/transfer`, "POST", body)
				.then((data) => {
					// Update the existing value
					setSendHistory((prev) => [data, ...prev]);
					toast("Successful Transaction", {
						className: "!bg-green-700",
						description: "Your send transaction was successful",
						action: {
							label: "View",
							onClick: () => {
								window.open(
									`${chain?.blockExplorers?.default.url}/tx/${
										isNativeToken() ? sendHash : hash
									}`,
									"_blank"
								);
							},
						},
					});
				})
				.catch(() => {
					toast("Successful Transaction", {
						className: "!bg-green-700",
						description:
							"Your send transaction was successful but not recorded in the database",
						action: {
							label: "View",
							onClick: () => {
								window.open(
									`${chain?.blockExplorers?.default.url}/tx/${
										isNativeToken() ? sendHash : hash
									}`,
									"_blank"
								);
							},
						},
					});
				})
				.finally(() => {
					isNativeToken() ? resetSendHash() : reset();
					setIsSendToken(false);
				});
		} else if (!isConfirming) {
			toast("Failed Transaction", {
				className: "!bg-red-700",
				description: "Your send transaction was not successful",
				action: {
					label: "View",
					onClick: () => {
						window.open(
							`${chain?.blockExplorers?.default.url}/tx/${hash}`,
							"_blank"
						);
					},
				},
			});
		}
	}, [
		reset,
		resetSendHash,
		isConfirming,
		isConfirmed,
		chain,
		hash,
		sendHash,
		sendToken,
		sendAddress,
		sendAmount,
		isNativeToken,
	]);

	const location = useLocation();

	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<SendRecieveSwapTab activeLink={location.pathname} />
			<div className="md:m-[6px] md:border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px]  px-[8px] md:px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<h4 className="text-header mt-0">Send Tokens</h4>
				<div className="cluster-card-1 md:!py-[40px] rounded-[20px] mt-[20px] flex items-center justify-start flex-col gap-y-[30px] px-[10px] py-[20px]">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[20px] gap-y-[20px] w-full max-w-screen-lg">
						<div className="flex flex-col gap-y-[10px]">
							<p className="text-[14px] font-medium">Select Token</p>
							<SelectTokens type="send" headline="Select Token" />
						</div>
						<div className="flex flex-col gap-y-[10px] relative">
							<p className="text-[14px] font-medium">Enter Amount</p>
							<CustomInput
								type="token"
								value={sendAmount}
								placeholder="Enter Token Amount"
								onChange={(value) => setSendAmount(value.target.value)}
							/>
							{sendToken &&
								(Number(balanceData) / 10 ** sendToken.decimals).toFixed(6) !==
									sendAmount && (
									<Badge
										onClick={() => {
											if (balanceData)
												setSendAmount(
													(
														Number(balanceData) /
														10 ** sendToken.decimals
													).toFixed(6)
												);
											else if (isNativeToken()) {
												setSendAmount(
													Number(nativeBalance?.formatted).toFixed(6)
												);
											}
										}}
										className="absolute right-3 top-[43%] btn-gradient-style !w-fit !min-w-[50px] !px-2"
									>
										Max
									</Badge>
								)}
							<div className="w-full flex justify-end">
								<p className="text-[#a7a7a7] font-normal text-xs">
									Balance:{" "}
									{(() => {
										if (!sendToken) return 0;
										if (isNativeToken()) {
											return Number(nativeBalance?.formatted).toFixed(6);
										} else
											return balanceData
												? (
														Number(balanceData) /
														10 ** sendToken.decimals
												  ).toFixed(6)
												: 0;
									})()}{" "}
									{sendToken?.symbol}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-y-[10px]">
							<p className="text-[14px] font-medium">Receiver Address</p>
							<CustomInput
								type="address"
								placeholder="Enter Receiver's Address"
								onChange={(value) => setSendAddress(value.target.value)}
							/>
						</div>
					</div>
					<button
						disabled={
							isPending || isSendHashPending || (isConfirming && isSendToken)
						}
						onClick={() => sendTokenCall()}
						className="btn-gradient-style w-fit min-w-[180px]"
					>
						<SendSVG className="text-white rotate-[-90deg] w-[24px] h-[24px]" />
						<span className="text-base font-medium ">
							{isPending || (isSendHashPending && isSendToken)
								? "Sending..."
								: isConfirming && isSendToken
								? "Confirming..."
								: "Send Tokens"}
						</span>
					</button>
				</div>
				<div className="text-header flex justify-between w-full items-center !mt-8">
					Recent Sends
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
								<TableHead className="p-5 text-left">Token</TableHead>
								<TableHead className="p-5 text-center">To</TableHead>
								<TableHead className="p-5 text-center">Hash</TableHead>
								<TableHead className="text-right p-5">Amount</TableHead>
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
												<div className="flex flex-col items-start">
													<span className="text-[#a7a7a7] font-medium text-xs">
														{tx.tokenName}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex justify-center items-center gap-x-2 text-[#a7a7a7] text-sm font-medium">
												{tx?.to
													? `${tx?.to.slice(0, 4)}...${tx?.to.slice(-4)} `
													: "~"}
												<CopySVG
													className="text-[#493844] cursor-pointer active:scale-90 "
													onClick={() => copyToClipboard(tx?.to)}
												/>
											</div>
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
										<TableCell className="text-right">
											{tx.amount} MATIC ≈ {(tx?.valueInUSD ?? 0).toFixed(6)}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className="text-center">
										<p className="text-[#a7a7a7] text-base py-6 text-center">
											No Recent Send Transactions
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
							<TokenDetailsContainer key={index} tx={tx} type="send" />
						))}
				</div>
			</div>
		</section>
	);
};

export default SendPage;

import { useCallback, useContext, useEffect, useRef } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { fetchData } from "../helper/fetchData";
import { BASE_URL } from "../lib/config";
import { MyStore } from "../helper/MyStore";
import { useNetwork } from "../hooks/useNetwork";
import { useSendToken } from "../hooks/useSendToken";
import { useSwap } from "../hooks/useSwap";

interface ChatButtonProps {
	buttonText: string;
	params: any;
	isLast?: boolean;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
	buttonText,
	params,
	isLast,
}) => {
	console.log("🚀 ~ params:", params);
	const { chain } = useAccount();
	const { switchChainAsync } = useSwitchChain();
	const isTxLoading = useRef(false);
	const { selectedChat, isChatLoading, setIsChatLoading, setChatHistory } =
		useContext(MyStore);

	const {
		sendParam,
		error: sendTokenError,
		isSuccess: isSendTokenSuccess,
		isTxLoading: isSendTokenTxLoading,
		isSimulateSuccess: isSendTokenSimulateSuccess,
		sendToken,
	} = useSendToken({
		to: params?.to ?? "",
		amount: params?.amount ?? "",
		tokenAddress: params?.tokenAddress ?? "",
	});

	const {
		executeSwap,
		error: swapError,
		isSuccess: isSwapSuccess,
		isTxLoading: isSwappingTxLoading,
		hash: swapHash,
		swapParam,
	} = useSwap({
		tokenIn: params?.tokenIn,
		tokenOut: params?.tokenOut,
		amount: params?.amount,
		isNativeTokenIn: params?.isNativeTokenIn,
		isNativeTokenOut: params?.isNativeTokenOut,
		chain: params?.chain,
	});

	const { setNetwork } = useNetwork();

	const sendMessage = useCallback(
		async (message: string) => {
			await fetchData(`${BASE_URL}/assistant/chat`, "POST", {
				message,
				chatId: selectedChat,
				chainId: params?.chain,
				role: "assistant",
			});
			setChatHistory((prevHistory: any) => [
				...prevHistory,
				{ content: message, chatId: selectedChat, role: "assistant" },
			]);
		},
		[params?.chain, selectedChat, setChatHistory]
	);

	const confirmSwap = useCallback(async () => {
		if (
			!isSwappingTxLoading &&
			swapHash?.length > 0 &&
			isSwapSuccess &&
			isTxLoading.current
		) {
			isTxLoading.current = false;
			const body = { ...swapParam, txHash: swapHash ?? [] };
			const message = `Swap Transaction confirmed! Check the transaction on the blockchain explorer: ${swapHash.map(
				(hash: string, index) => {
					return `<a class="chat-link" href="${
						chain?.blockExplorers?.default.url
					}/tx/${hash}" target="_blank" class="text-blue-500 underline"> View Transaction ${
						index + 1
					}</a>`;
				}
			)}`;
			await sendMessage(message);
			await fetchData(`${BASE_URL}/activity/transfer`, "POST", body);
			setIsChatLoading(false);
		}
	}, [
		isSwappingTxLoading,
		swapHash,
		isSwapSuccess,
		swapParam,
		sendMessage,
		setIsChatLoading,
		chain?.blockExplorers?.default.url,
	]);

	const confirmSend = useCallback(async () => {
		if (
			!isSendTokenTxLoading &&
			sendParam.txHash.length > 0 &&
			isSendTokenSuccess &&
			isTxLoading.current
		) {
			isTxLoading.current = false;
			const message = `Send Transaction Confirmed! Check your transaction on the blockchain explorer: <a class="chat-link" href="${chain?.blockExplorers?.default.url}/tx/${sendParam?.txHash[0]}" target="_blank" class="text-blue-500 underline">View Transaction</a>`;
			await sendMessage(message);
			await fetchData(`${BASE_URL}/activity/transfer`, "POST", sendParam);
			setIsChatLoading(false);
		}
	}, [
		sendParam,
		isSendTokenSuccess,
		isSendTokenTxLoading,
		chain?.blockExplorers?.default.url,
		sendMessage,
		setIsChatLoading,
	]);

	useEffect(() => {
		if (sendTokenError && isSendTokenTxLoading) {
			const message = "Transaction Failed! Please try again later.";
			sendMessage(message);
			setIsChatLoading(false);
			isTxLoading.current = false;
		}
	}, [sendTokenError, isSendTokenTxLoading, sendMessage, setIsChatLoading]);

	useEffect(() => {
		if (swapError && isSwappingTxLoading) {
			const message = "Transaction Failed! Please try again later.";
			sendMessage(message);
			setIsChatLoading(false);
			isTxLoading.current = false;
		}
	}, [swapError, isSwappingTxLoading, sendMessage, setIsChatLoading]);

	useEffect(() => {
		if ((swapHash?.length ?? 0) > 0 && !isSwappingTxLoading && isSwapSuccess) {
			confirmSwap();
		}
	}, [swapHash, isSwappingTxLoading, isSwapSuccess, confirmSwap]);

	useEffect(() => {
		if (!isSendTokenTxLoading && isSendTokenSuccess) {
			confirmSend();
		}
	}, [isSendTokenTxLoading, isSendTokenSuccess, confirmSend]);

	const switchNetwork = useCallback(
		async (chainId: number) => {
			try {
				await switchChainAsync({ chainId });
				await sendMessage("You have successfully switched the network.");
				setIsChatLoading(false);
			} catch (error) {
				await sendMessage(
					"Failed to switch the network. Please try again later."
				);
				setIsChatLoading(false);
			}
		},
		[switchChainAsync, sendMessage, setIsChatLoading]
	);

	const confirmTransaction = useCallback(async () => {
		setIsChatLoading(true);
		if (params.type === "switch-network") {
			await switchNetwork(params.chain);
		} else if (params.type === "send-token" || params.type === "send-native") {
			await setNetwork(params.chain);
			if (
				(params.tokenAddress && isSendTokenSimulateSuccess) ||
				!params.tokenAddress
			) {
				await sendToken();
				isTxLoading.current = true;
			}
		} else if (params.type === "swap-tokens") {
			await setNetwork(params.chain);
			await executeSwap();
			isTxLoading.current = true;
		}
	}, [
		params,
		switchNetwork,
		setNetwork,
		isSendTokenSimulateSuccess,
		sendToken,
		executeSwap,
		setIsChatLoading,
	]);

	return (
		<>
			{isLast && !isChatLoading && (
				<div className="flex gap-x-2 justify-start items-center">
					<button
						disabled={isChatLoading}
						onClick={() =>
							sendMessage("Transaction is successfully cancelled.")
						}
						className="cancelChatBtn rounded-[3px] mb-[20px] mt-[20px] hover:transition-all hover:w-full"
					>
						Cancel
					</button>
					<button
						disabled={isChatLoading}
						onClick={confirmTransaction}
						className="newChatBtn rounded-[3px] mb-[20px] mt-[20px] hover:transition-all hover:w-full"
					>
						{buttonText}
					</button>
				</div>
			)}

			{isLast && isChatLoading && (
				<button
					disabled
					className="cancelChatBtn rounded-[3px] mb-[20px] mt-[20px] hover:transition-all hover:w-full"
				>
					Processing...
				</button>
			)}

			{!isLast && (
				<button
					disabled
					className="cancelChatBtn rounded-[3px] mb-[20px] mt-[20px] hover:transition-all hover:w-full"
				>
					Session Expired
				</button>
			)}
		</>
	);
};

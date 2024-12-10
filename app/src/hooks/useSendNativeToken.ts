import { useEffect, useState, useCallback } from "react";
import {
	useWaitForTransactionReceipt,
	useSendTransaction,
	useAccount,
} from "wagmi";
import { useNetwork } from "../hooks/useNetwork";

export function useSendNativeToken({
	to,
	amount,
}: {
	to: `0x${string}`;
	amount: string;
}) {
	// console.log("useSendNativeToken", { to, amount });
	const { selectedNetwork } = useNetwork();
	const { address } = useAccount();
	const [isTxLoading, setIsTxLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [sendParam, setSendParam] = useState({
		tokenName: "",
		tokenAddress: "",
		to: "",
		amount: "",
		txHash: [] as any[],
		valueInUSD: 0,
	});

	const {
		data: sendHash,
		isPending: isSendHashPending,
		isSuccess: isSendHashSuccess,
		sendTransactionAsync,
		error: sendError,
		reset: resetSend,
	} = useSendTransaction();

	const { status: waitForTransactionStatus, error: transactionError } =
		useWaitForTransactionReceipt({
			confirmations: 3,
			hash: sendHash,
		});

	useEffect(() => {
		setIsTxLoading(isSendHashPending ? true : false);
		if (isSendHashSuccess) setIsTxLoading(false);
	}, [isSendHashPending, isSendHashSuccess]);

	useEffect(() => {
		if (waitForTransactionStatus === "pending" && sendHash) {
			setIsLoading(true);
		} else if (waitForTransactionStatus === "success") {
			setIsSuccess(true);
			setIsLoading(false);
			setSendParam({
				tokenName: selectedNetwork.nativeCurrency.name,
				tokenAddress: selectedNetwork.nativeCurrency.name,
				to,
				amount,
				txHash: [sendHash],
				valueInUSD: 0,
			});
			resetSend();
		} else if (waitForTransactionStatus === "error") {
			setIsLoading(false);
			setError(transactionError || sendError);
			resetSend();
		}
	}, [
		waitForTransactionStatus,
		transactionError,
		sendError,
		resetSend,
		sendHash,
		selectedNetwork.nativeCurrency.name,
		to,
		amount,
	]);

	const sendNativeToken = useCallback(async () => {
		setIsTxLoading(true);
		try {
			await sendTransactionAsync({
				account: address,
				to: to as `0x${string}`,
				value: BigInt(
					Number(amount) *
						10 ** (selectedNetwork.nativeCurrency.decimals as number)
				),
			});
		} catch (err) {
			console.error("Error sending native token:", err);
			setError(err as Error);
			setIsTxLoading(false);
		}
	}, [
		sendTransactionAsync,
		address,
		to,
		amount,
		selectedNetwork.nativeCurrency.decimals,
	]);

	return {
		isTxLoading,
		isLoading,
		isSuccess,
		error,
		sendParam,
		sendNativeToken,
	};
}

import { useEffect, useState, useCallback } from "react";
import {
	useSimulateContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import { W_ERC20_ABI } from "../utils/contracts";
import { useNetwork } from "./useNetwork";

export function useWrapToken({
	amount,
	tokenAddress,
	type,
	wrappedName,
}: {
	amount: string;
	tokenAddress: `0x${string}`;
	type: "deposit" | "withdraw";
	wrappedName?: string;
}) {
	const [isSimulateLoading, setIsSimulateLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hash, setHash] = useState<`0x${string}` | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const { selectedNetwork } = useNetwork();
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
		data: simulateData,
		error: simulateError,
		isSuccess: isSimulateSuccess,
		status: simulateStatus,
	} = useSimulateContract({
		address: tokenAddress,
		abi: W_ERC20_ABI,
		functionName: type === "deposit" ? "deposit" : "withdraw",
		args: type === "withdraw" ? [BigInt(Number(amount ?? 0))] : [],
		value: type === "deposit" ? BigInt(amount ?? 0) : (BigInt(0) as any),
	});

	const {
		data: dataHash,
		isSuccess: isWriteSuccess,
		writeContractAsync,
		isPending: isWritePending,
		status: writeStatus,
		error: writeError,
		reset,
	} = useWriteContract();

	const { status: waitForTransactionStatus, error: transactionError } =
		useWaitForTransactionReceipt({
			confirmations: 2,
			hash: dataHash,
		});

	useEffect(() => {
		if (dataHash && waitForTransactionStatus === "pending") {
			setIsLoading(true);
			setHash(dataHash);
		} else if (
			waitForTransactionStatus === "success" &&
			writeStatus === "success"
		) {
			setIsSuccess(true);
			setIsLoading(false);
			reset();
		} else if (
			waitForTransactionStatus === "error" ||
			writeStatus === "error"
		) {
			setIsLoading(false);
			setError(writeError ?? transactionError);
			reset();
		} else if (writeStatus === "idle") {
			setIsLoading(false);
			reset();
		}

		setIsSimulateLoading(simulateStatus === "pending");
	}, [
		waitForTransactionStatus,
		simulateStatus,
		transactionError,
		isWriteSuccess,
		isWritePending,
		dataHash,
		reset,
		writeStatus,
		writeError,
	]);

	const execute = useCallback(async () => {
		if (isSimulateSuccess && !isSimulateLoading && simulateData) {
			try {
				await writeContractAsync(simulateData.request);
				setSwapParam({
					tokenAName: (type === "deposit"
						? selectedNetwork.nativeCurrency.name
						: wrappedName) as string,
					tokenBName: (type === "deposit"
						? wrappedName
						: selectedNetwork.nativeCurrency.name) as string,
					tokenAAddress: (type === "deposit"
						? selectedNetwork.nativeCurrency.name
						: tokenAddress) as string,
					tokenBAddress: (type === "deposit"
						? tokenAddress
						: selectedNetwork.nativeCurrency.name) as string,
					amountA: Number(amount),
					amountB: Number(amount),
					txHash: [hash] as string[],
					valueAinUSD: 0,
					valueBinUSD: 0,
				});
			} catch (err) {
				console.log("🚀 ~ execute ~ err:", err);
				setError(err as Error);
			}
		}
	}, [
		isSimulateSuccess,
		isSimulateLoading,
		simulateData,
		writeContractAsync,
		type,
		selectedNetwork.nativeCurrency.name,
		wrappedName,
		tokenAddress,
		amount,
		hash,
	]);

	return {
		isLoading,
		isSuccess,
		isSimulateSuccess,
		simulateError,
		error,
		hash,
		swapParam,
		execute,
	};
}

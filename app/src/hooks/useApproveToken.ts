import { useEffect, useState, useCallback } from "react";
import {
	// useReadContract,
	useSimulateContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import { ERC20_ABI } from "../utils/contracts";

export function useApproveToken({
	spender,
	amount,
	tokenAddress,
}: {
	spender: `0x${string}`;
	amount: string;
	tokenAddress: `0x${string}`;
}) {
	// const [isTxLoading, setIsTxLoading] = useState(false);
	const [isSimulateLoading, setIsSimulateLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hash, setHash] = useState<`0x${string}` | null>(null);
	const [error, setError] = useState<Error | null>(null);

	// const decimals = useReadContract({
	// 	abi: ERC20_ABI,
	// 	address: tokenAddress,
	// 	functionName: "decimals",
	// });

	const {
		data: simulateData,
		error: simulateError,
		isSuccess: isSimulateSuccess,
		status: simulateStatus,
	} = useSimulateContract({
		address: tokenAddress,
		abi: ERC20_ABI,
		functionName: "approve",
		args: [
			spender,
			BigInt(amount ?? 0),
			// * BigInt(10) ** BigInt(decimals?.data ?? (0 as number)),
		],
	});

	const {
		data: dataHash,
		isSuccess: isWriteSuccess,
		writeContractAsync,
		error: writeError,
		isPending: isWritePending,
		status: writeStatus,
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
		} else if (waitForTransactionStatus === "success") {
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
		isWritePending,
		isWriteSuccess,
		waitForTransactionStatus,
		simulateStatus,
		transactionError,
		writeStatus,
		dataHash,
		writeError,
		reset,
		hash,
	]);

	const execute = useCallback(async () => {
		setIsLoading(true);
		if (isSimulateSuccess && !isSimulateLoading && simulateData) {
			try {
				await writeContractAsync(simulateData.request);
			} catch (err) {
				setError(err as Error);
				setIsLoading(false);
			}
		}
	}, [isSimulateSuccess, isSimulateLoading, simulateData, writeContractAsync]);

	return {
		isLoading,
		isSuccess,
		isSimulateSuccess,
		simulateError,
		error,
		hash,
		execute,
	};
}

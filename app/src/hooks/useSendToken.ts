import { useEffect, useState, useCallback } from "react";
import {
	useReadContract,
	useSimulateContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import { ERC20_ABI } from "../utils/contracts";
import { useSendNativeToken } from "./useSendNativeToken";

type SendTokenResponse = {
	isTxLoading: boolean;
	isLoading: boolean;
	isSuccess: boolean;
	isSimulateSuccess: boolean;
	simulateError: Error | null;
	error: Error | null;
	sendToken: () => Promise<void>;
	sendParam: {
		tokenName: string;
		tokenAddress: string;
		to: string;
		amount: string;
		txHash: string[];
		valueInUSD: number;
	};
};
export function useSendToken({
	to,
	amount,
	tokenAddress,
}: {
	to: `0x${string}`;
	amount: string;
	tokenAddress?: `0x${string}`;
}): SendTokenResponse {
	const { data: tokenName, isFetched } = useReadContract({
		abi: ERC20_ABI,
		address: tokenAddress,
		functionName: "name",
	});
	const [isTxLoading, setIsTxLoading] = useState(false);
	const [isSimulateLoading, setIsSimulateLoading] = useState(false);
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
	const { sendNativeToken, ...nativeTokenState } = useSendNativeToken({
		to,
		amount,
	});
	const decimals = tokenAddress
		? useReadContract({
				abi: ERC20_ABI,
				address: tokenAddress,
				functionName: "decimals",
		  })
		: null;

	const {
		data: simulateData,
		error: simulateError,
		isSuccess: isSimulateSuccess,
		status: simulateStatus,
	} = tokenAddress
		? useSimulateContract({
				address: tokenAddress,
				abi: ERC20_ABI,
				functionName: "transfer",
				args: [
					to,
					decimals?.data !== undefined && decimals?.data !== null
						? BigInt(Number(amount) * 10 ** decimals?.data)
						: BigInt(0),
				],
		  })
		: { data: null, error: null, isSuccess: false, status: "idle" };

	const {
		data: hash,
		isSuccess: isWriteSuccess,
		writeContractAsync,
		isPending: isWritePending,
		isPaused: isWritePaused,
		reset,
	} = useWriteContract();

	const { status: waitForTransactionStatus, error: transactionError } =
		useWaitForTransactionReceipt({
			confirmations: 3,
			hash: hash,
		});

	useEffect(() => {
		setIsTxLoading(isWritePending || isWritePaused);
		if (isWriteSuccess) setIsTxLoading(false);
	}, [isWriteSuccess, isWritePending, isWritePaused]);

	useEffect(() => {
		if (waitForTransactionStatus === "pending" && hash) {
			setIsLoading(true);
		} else if (waitForTransactionStatus === "success") {
			if (hash) {
				setSendParam({
					tokenName: isFetched ? (tokenName as string) : "",
					tokenAddress: tokenAddress as string,
					to,
					amount,
					txHash: [hash],
					valueInUSD: 0,
				});
			}
			setIsSuccess(true);
			setIsLoading(false);
			reset();
		} else if (waitForTransactionStatus === "error") {
			setIsLoading(false);
			setError(transactionError);
			reset();
		}

		setIsSimulateLoading(simulateStatus === "pending");
	}, [
		waitForTransactionStatus,
		simulateStatus,
		transactionError,
		reset,
		hash,
		isFetched,
		tokenName,
		tokenAddress,
		to,
		amount,
	]);

	const sendToken = useCallback(async () => {
		setIsTxLoading(true);
		if (tokenAddress) {
			if (isSimulateSuccess && !isSimulateLoading && simulateData) {
				try {
					await writeContractAsync(simulateData.request);
				} catch (err) {
					setError(err as Error);
					setIsTxLoading(false);
				}
			}
		}
	}, [
		isSimulateSuccess,
		isSimulateLoading,
		simulateData,
		writeContractAsync,
		tokenAddress,
	]);

	return tokenAddress
		? {
				isTxLoading,
				isLoading,
				isSuccess,
				isSimulateSuccess,
				simulateError,
				error,
				sendToken,
				sendParam,
		  }
		: {
				...nativeTokenState,
				sendToken: sendNativeToken,
				isSimulateSuccess: false,
				simulateError: null,
		  };
}

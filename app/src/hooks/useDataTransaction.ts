import { useEffect, useState, useCallback } from "react";
import {
	useWaitForTransactionReceipt,
	usePrepareTransactionRequest,
	useSendTransaction,
	useAccount,
} from "wagmi";

export function useDataTransaction({
	to,
	data,
	gasPrice,
	gasLimit,
	value,
	isNativeTokenIn,
}: {
	to: `0x${string}`;
	data: any;
	gasPrice: any;
	gasLimit: any;
	value: any;
	isNativeTokenIn?: boolean;
}) {
	const { address } = useAccount();
	// const [isTxLoading, setIsTxLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hash, setHash] = useState<`0x${string}` | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const { refetch, status: refetchStatus } = usePrepareTransactionRequest({
		account: address,
		to: to,
		data,
		gasPrice,
		gas: gasLimit,
		value: isNativeTokenIn ? value : null,
	});

	const {
		data: dataHash,
		isPending: isSendPending,
		isSuccess: isSendSuccess,
		sendTransactionAsync,
		error: sendError,
		status: sendStatus,
		reset: resetSend,
	} = useSendTransaction();

	const { status: waitForTransactionStatus, error: transactionError } =
		useWaitForTransactionReceipt({
			confirmations: 2,
			hash: dataHash,
		});

	useEffect(() => {
		// if (isSendSuccess && dataHash) {
		// 	setIsTxLoading(false);
		// } else {
		// 	setIsTxLoading(isSendPending ? true : false);
		// }
		if (dataHash && waitForTransactionStatus === "pending") {
			setIsLoading(true);
			setHash(dataHash);
		} else if (waitForTransactionStatus === "success") {
			setIsSuccess(true);
			setIsLoading(false);
			resetSend();
		} else if (waitForTransactionStatus === "error") {
			setIsLoading(false);
			setError(transactionError || sendError);
			resetSend();
		}
	}, [
		isSendPending,
		isSendSuccess,
		waitForTransactionStatus,
		refetchStatus,
		transactionError,
		sendError,
		sendStatus,
		dataHash,
		resetSend,
		hash,
	]);

	const execute: () => Promise<void> = useCallback(async () => {
		setIsLoading(true);
		try {
			const { data } = await refetch();
			if (data)
				await sendTransactionAsync({
					account: data.account,
					to: data.to as `0x${string}`,
					data: data.data,
					gasPrice: BigInt(Number(data.gasPrice ?? 0)),
					value: BigInt(Number(data?.value ?? 0)),
					gas: BigInt(Number(data?.gas ?? 0)),
					nonce: data.nonce,
				});
		} catch (err) {
			setError(err as Error);
			setIsLoading(false);
		}
	}, [sendTransactionAsync, refetch]);

	return {
		isLoading,
		isSuccess,
		error,
		hash,
		execute,
	};
}

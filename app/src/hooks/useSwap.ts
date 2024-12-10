import { useEffect, useState } from "react";
import { useApproveToken } from "./useApproveToken";
import { useDataTransaction } from "./useDataTransaction";
import { fetchData } from "../helper/fetchData";
import { BASE_URL } from "../lib/config";
import { useAccount } from "wagmi";
import { QuoteResponse } from "./swap";
import { wrappedTokenData } from "../utils/chain";

export function useSwap({
	tokenIn,
	tokenOut,
	amount,
	isNativeTokenIn,
	isNativeTokenOut,
	chain,
}: {
	tokenIn: `0x${string}`;
	tokenOut: `0x${string}`;
	amount: number;
	isNativeTokenIn: boolean;
	isNativeTokenOut: boolean;
	chain: string;
}) {
	const [hashes, setHashes] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isTxLoading, setIsTxLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<Error | null>(null);
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

	const { address } = useAccount();

	const {
		debankChainId,
		wrappedAddress: wrappedToken,
		nativeAddress,
	} = wrappedTokenData({
		chain,
	});
	const [quote, setQuote] = useState<QuoteResponse>({} as QuoteResponse);

	useEffect(() => {
		if (!tokenIn || !tokenOut || !amount || !address) {
			return;
		}
		async function startFetching() {
			try {
				const gasPriceData = await fetchData(
					`${BASE_URL}/activity/gasPrice?chainId=${debankChainId}`
				);
				const quoteData = await fetchData(
					`${BASE_URL}/activity/oo-swap?chain=${debankChainId}&inTokenAddress=${
						isNativeTokenIn ? nativeAddress : tokenIn
					}&outTokenAddress=${
						isNativeTokenOut ? nativeAddress : tokenOut
					}&amount=${amount}&slippage=${3}&gasPrice=${
						gasPriceData?.fast
					}&account=${address}`
				);
				setQuote(quoteData);
			} catch (error) {
				setError(new Error("Error fetching quote"));
			}
		}
		startFetching();
		return () => {};
	}, [
		debankChainId,
		tokenIn,
		tokenOut,
		amount,
		address,
		isNativeTokenIn,
		isNativeTokenOut,
		wrappedToken,
		nativeAddress,
	]);
	const {
		execute: approveToken,
		isSuccess: isApproveSuccess,
		hash: approveHash,
		error: approveError,
	} = useApproveToken({
		spender: quote?.to as `0x${string}`,
		amount: quote?.inAmount,
		tokenAddress: quote?.inToken?.address as `0x${string}`,
	});

	const {
		isSuccess: isDataSuccess,
		hash: dataHash,
		error: dataError,
		execute: dataTransaction,
	} = useDataTransaction({
		data: quote?.data,
		to: quote?.to as `0x${string}`,
		gasLimit: quote?.estimatedGas,
		gasPrice: quote?.gasPrice,
		value: quote?.inAmount,
		isNativeTokenIn,
	});

	useEffect(() => {
		if (!isLoading) return;
		// if is native token in and data success
		// set is success to true and set isTxLoading to false
		if (isNativeTokenIn && isDataSuccess) {
			setIsSuccess(true);
			setIsTxLoading(false);
			setHashes([dataHash]);
			setIsLoading(false);
			return () => {};
		}
		// if is native token out and approve success, data success
		// set is success to true and set isTxLoading to false
		if (isApproveSuccess && isDataSuccess) {
			setIsSuccess(true);
			setIsTxLoading(false);
			setIsLoading(false);
			setHashes([approveHash, dataHash]);
			return () => {};
		}

		setError(approveError || dataError);
		setSwapParam({
			tokenAName: quote?.inToken?.name,
			tokenBName: quote?.outToken?.name,
			tokenAAddress: quote?.inToken?.address,
			tokenBAddress: quote?.outToken?.address,
			amountA: Number(quote?.inAmount) / 10 ** Number(quote?.inToken?.decimals),
			amountB: quote?.outAmount
				? Number(quote?.outAmount) / 10 ** Number(quote?.outToken?.decimals)
				: 0,
			txHash: hashes,
			valueAinUSD: 0,
			valueBinUSD: 0,
		});
		return () => {};
	}, [
		approveError,
		approveHash,
		dataError,
		dataHash,
		hashes,
		isApproveSuccess,
		isDataSuccess,
		isLoading,
		isNativeTokenIn,
		quote?.inAmount,
		quote?.inToken?.address,
		quote?.inToken?.decimals,
		quote?.inToken?.name,
		quote?.outAmount,
		quote?.outToken?.address,
		quote?.outToken?.decimals,
		quote?.outToken?.name,
	]);

	useEffect(() => {
		const actions = async () => {
			if (isTxLoading) {
				if (isApproveSuccess && approveHash && !dataHash) {
					if (isLoading) {
						setHashes((prev) => [...prev, approveHash].filter(Boolean));
						setIsLoading(false);
						await dataTransaction();
						return;
					}
				}
			}
		};
		actions();
		return () => {};
	}, [
		approveHash,
		dataHash,
		dataTransaction,
		isApproveSuccess,
		isDataSuccess,
		isLoading,
		isNativeTokenIn,
		isNativeTokenOut,
		isTxLoading,
	]);

	const executeSwap = async () => {
		if (isNativeTokenIn) {
			setIsTxLoading(true);
			setIsLoading(true);
			await dataTransaction();
			return;
		} else {
			setIsTxLoading(true);
			setIsLoading(true);
			await approveToken();
		}
	};
	return {
		isTxLoading,
		isSuccess,
		error,
		hash: hashes,
		swapParam,
		executeSwap,
	};
}

import { useEffect, useState } from "react";
import { fetchData } from "../helper/fetchData";
import { BASE_URL } from "../lib/config";
export type QuoteResponse = {
	readonly inToken: Token;
	readonly outToken: Token;
	readonly inAmount: string;
	readonly outAmount: string;
	readonly estimatedGas: string;
	readonly minOutAmount: string;
	readonly from: string;
	readonly to: string;
	readonly value: string;
	readonly gasPrice: string;
	readonly data: string;
	readonly chainId: number;
	readonly rfqDeadline: number;
};

type Token = {
	readonly address: string;
	readonly decimals: number;
	readonly symbol: string;
	readonly name: string;
};

type UseQuoteParams = {
	chainId: number;
	inTokenAddress: `0x${string}`;
	outTokenAddress: `0x${string}`;
	amount: number;
	slippage: number;
	gasPrice: number;
	account: `0x${string}`;
};

const chainMap: Record<number, string> = {
	1: "eth",
	56: "bsc",
	137: "polygon",
	250: "avax",
	42161: "arbitrum",
};
type GasPrice = {
	readonly standard: number;
	readonly fast: number;
	readonly instant: number;
};

export const useGasPrice = (chainId: number) => {
	const chain = chainMap[chainId] || "eth";
	const [gasPrice, setGasPrice] = useState<GasPrice>({
		fast: 0,
		instant: 0,
		standard: 0,
	});
	useEffect(() => {
		const fetchGasPrice = async () => {
			const gasPriceData = await fetchData(
				`${BASE_URL}/activity/gasPrice?chainId=${chain}`
			);
			setGasPrice(gasPriceData);
		};
		fetchGasPrice();
	}, [chain]);

	return { gasPrice };
};

export const useQuote = ({
	chainId,
	inTokenAddress,
	outTokenAddress,
	amount,
	slippage,
	gasPrice,
	account,
}: UseQuoteParams) => {
	const chain = chainMap[chainId] || "eth";

	const [quote, setQuote] = useState<QuoteResponse | undefined>(undefined);
	useEffect(() => {
		const fetchQuote = async () => {
			if (
				!chain ||
				!inTokenAddress ||
				!outTokenAddress ||
				!amount ||
				!slippage ||
				!gasPrice ||
				!account
			) {
				return;
			}

			try {
				const quoteData = await fetchData(
					`${BASE_URL}/activity/oo-swap?chain=${chain}&inTokenAddress=${inTokenAddress}&outTokenAddress=${outTokenAddress}&amount=${amount}&slippage=${slippage}&gasPrice=${gasPrice}&account=${account}`
				);
				setQuote(quoteData);
			} catch (error) {
				console.error("Error fetching quote:", error);
				setQuote(undefined);
			}
		};

		fetchQuote();
	}, [
		chain,
		inTokenAddress,
		outTokenAddress,
		amount,
		slippage,
		gasPrice,
		account,
	]);

	return { quote };
};

export const waitSeconds = (seconds: number) =>
	new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export function wrappedTokenData({ chain }: { chain: string }) {
	const chainData: {
		[key: string]: {
			debankChainId: string;
			wrappedAddress: `0x${string}`;
			name: string;
			nativeAddress: `0x${string}`;
			networkIndex: number;
		};
	} = {
		ethereum: {
			debankChainId: "eth",
			wrappedAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
			name: "WETH",
			nativeAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
			networkIndex: 0,
		},
		"binance-smart-chain": {
			debankChainId: "bsc",
			wrappedAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
			nativeAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
			name: "WBNB",
			networkIndex: 4,
		},
		avalanche: {
			debankChainId: "avax",
			wrappedAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
			nativeAddress: "0x0000000000000000000000000000000000000000",
			name: "WAVAX",
			networkIndex: 6,
		},
		"arbitrum-one": {
			debankChainId: "arbitrum",
			wrappedAddress: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
			nativeAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
			name: "WETH",
			networkIndex: 1,
		},
		"polygon-pos": {
			debankChainId: "polygon",
			wrappedAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
			nativeAddress: "0x0000000000000000000000000000000000001010",
			name: "WMATIC",
			networkIndex: 2,
		},
		"optimistic-ethereum": {
			debankChainId: "optimism",
			wrappedAddress: "0x4200000000000000000000000000000000000006",
			nativeAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
			name: "WETH",
			networkIndex: 3,
		},
		base: {
			debankChainId: "base",
			wrappedAddress: "0x4200000000000000000000000000000000000006",
			nativeAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
			name: "WETH",
			networkIndex: 5,
		},
	};
	const debankChainId = chainData[chain]?.debankChainId;
	const wrappedAddress = chainData[chain]?.wrappedAddress;
	const networkIndex = chainData[chain]?.networkIndex;
	const name = chainData[chain]?.name;
	const nativeAddress = chainData[chain]?.nativeAddress;
	return {
		debankChainId,
		wrappedAddress,
		networkIndex,
		wrappedName: name,
		nativeAddress,
	};
}

export const isNativePair = (
	tokenIn: any,
	tokenOut: any,
	wrappedToken: any
) => {
	if (
		(tokenIn === wrappedToken && tokenOut === "native") ||
		(tokenOut === wrappedToken && tokenIn === "native")
	) {
		return true;
	}
	return false;
};

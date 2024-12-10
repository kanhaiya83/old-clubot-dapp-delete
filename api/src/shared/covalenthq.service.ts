import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { Chain, ChainID, Chains, CovalentClient } from "@covalenthq/client-sdk";
import { ReqUser } from "src/users/schema/user.schema";
export const chainIdToName = {
	1: "eth-mainnet",
	137: "matic-mainnet",
	56: "bsc-mainnet",
	42161: "arbitrum-mainnet",
	8453: "base-mainnet",
	43114: "avalanche-mainnet",
	10: "optimism-mainnet",
};
export const chainNameToId = {
	eth: 1,
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Ethereum: 1,
	mainnet: 1,
	bsc: 56,
	"Binance Smart Chain": 56,
	avax: 43114,
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Avalanche: 43114,
	base: 8453,
	"Base Network": 8453,
	matic: 137,
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Polygon: 137,
	arb: 42161,
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Arbitrum: 42161,
	op: 10,
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Optimism: 10,
};

export const chainNameToNativeAddress = {
	eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Ethereum: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	mainnet: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	bsc: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	"Binance Smart Chain": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	avax: "0x0000000000000000000000000000000000000000",
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Avalanche: "0x0000000000000000000000000000000000000000",
	base: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	"Base Network": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	matic: "0x0000000000000000000000000000000000001010",
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Polygon: "0x0000000000000000000000000000000000001010",
	arb: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Arbitrum: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	op: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
	// biome-ignore lint/style/useNamingConvention: <explanation>
	Optimism: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
};

export const supportedNames = [
	"eth",
	"matic",
	"bsc",
	"arb",
	"base",
	"avax",
	"op",
	"Ethereum",
	"Polygon",
	"Binance Smart Chain",
	"Arbitrum",
	"Base Network",
	"Avalanche",
	"Optimism",
];

export const chainIdToFullName = {
	1: "Ethereum Mainnet",
	137: "Polygon Mainnet",
	56: "BNB Smart Chain",
	42161: "Arbitrum Mainnet",
	8453: "Base Mainnet",
	43114: "Avalanche C-Chain Mainnet",
	10: "Optimism Mainnet",
} as const;

export const chainIdToDebankId = {
	1: "eth",
	137: "matic",
	56: "bsc",
	42161: "arb",
	8453: "base",
	43114: "avax",
	10: "op",
} as const;

export const debankIdToChainId = Object.fromEntries(
	Object.entries(chainIdToDebankId).map(([chainId, debankId]) => [
		debankId,
		parseInt(chainId),
	])
);

export const chainIdToCoingeckoId = {
	1: "ethereum",
	137: "polygon-pos",
	56: "binance-smart-chain",
	42161: "arbitrum-one",
	8453: "base",
	43114: "avalanche",
	10: "optimistic-ethereum",
};

export const debankChains = [
	"eth",
	"matic",
	"bsc",
	"arb",
	"base",
	"avax",
	"op",
];

@Injectable()
export class CovalentService {
	private client = new CovalentClient("cqt_rQgHHWvxvQ7kC4w7q3tGVTtKJktj");
	constructor(
		private readonly httpService: HttpService,
		private configService: ConfigService
	) {
		httpService.axiosRef.defaults.headers.Authorization =
			"Basic Y3F0X3JRZ0hIV3Z4dlE3a0M0dzdxM3RHVlR0S0prdGo6";
		httpService.axiosRef.defaults.headers.accept = "application/json";
		httpService.axiosRef.defaults.headers["Content-Type"] = "application/json";
	}

	async getGasPrice(chainId: Chain | Chains | ChainID) {
		// const { data } = await firstValueFrom(
		// 	this.httpService.get(
		// 		`https://api.covalenthq.com/v1/${chainIdToName[chainId]}/event/erc20/gas_prices/`
		// 	)
		// );
		// return data;
		const resp = await this.client.BaseService.getGasPrices(chainId, "erc20", {
			quoteCurrency: "USD",
		});
		return resp.data;
	}

	async getTokenBalancesForWalletAddress({
		chainId,
		userAddress,
	}: {
		chainId: Chain | Chains | ChainID;
		userAddress: string;
	}) {
		const resp =
			await this.client.BalanceService.getTokenBalancesForWalletAddress(
				chainId,
				userAddress,
				{
					quoteCurrency: "USD",
					noNftAssetMetadata: false,
					nft: false,
					noNftFetch: false,
					noSpam: true,
				}
			);

		// filter out dust

		const filteredNfties = resp.data.items;
		console.log("🚀 ~ CovalentService ~ filteredNfties:", filteredNfties);

		return filteredNfties;
	}

	async getNFTBalancesForWalletAddress({
		chainId,
		userAddress,
	}: {
		chainId: Chain | Chains | ChainID;
		userAddress: string;
	}) {
		console.log("🚀 ~ CovalentService ~ userAddress:", userAddress);
		console.log("🚀 ~ CovalentService ~ chainId:", chainId);
		const resp =
			await this.client.BalanceService.getHistoricalTokenBalancesForWalletAddress(
				chainId,
				userAddress,
				{
					quoteCurrency: "USD",
					noNftAssetMetadata: false,
					nft: true,
					noNftFetch: false,
					noSpam: false,
				}
			);
		console.log("🚀 ~ CovalentService ~ resp:", resp);
		console.log(
			"🚀 ~ CovalentService ~ resp?.data?.items:",
			resp?.data?.items[0]?.nft_data
		);

		// filter out dust
		const filteredNfties =
			resp?.data?.items?.filter(
				({
					type,
					contract_decimals,
					contract_display_name,
					contract_name,
					contract_ticker_symbol,
				}) =>
					type === "nft" &&
					(contract_decimals !== null ||
						contract_decimals !== null ||
						contract_display_name !== null ||
						contract_name !== null ||
						contract_ticker_symbol !== null)
			) ?? [];

		return filteredNfties;
	}
}

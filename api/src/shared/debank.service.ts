import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ReqUser } from "src/users/schema/user.schema";
export type DBankTokenList = {
	readonly id: string;
	readonly chain: string;
	readonly name: string;
	readonly symbol: string;
	readonly display_symbol: string;
	readonly optimized_symbol: string;
	readonly decimals: number;
	readonly logo_url: string;
	readonly protocol_id: string;
	readonly price: number;
	readonly price_24h_change: number;
	readonly is_verified: boolean;
	readonly is_core: boolean;
	readonly is_wallet: boolean;
	readonly time_at: number;
	readonly amount: number;
	readonly raw_amount: number;
	readonly raw_amount_hex_str: string;
};

@Injectable()
export class DebankService {
	constructor(
		private readonly httpService: HttpService,
		private configService: ConfigService
	) {
		httpService.axiosRef.defaults.headers.AccessKey =
			this.configService.get("DEBANK_API_KEY");
		httpService.axiosRef.defaults.headers.accept = "application/json";
	}

	async getAllBalances(address: string) {
		console.log("Calling Debank API ========> ");
		const { data } = await firstValueFrom(
			this.httpService.get(
				`https://pro-openapi.debank.com/v1/user/all_token_list?id=${address}&is_all=false`
			)
		);
		return data as DBankTokenList[];
	}

	async getTopHolders(token: string, chainId: string, limit = 10) {
		const { data } = await firstValueFrom(
			this.httpService.get(
				`https://pro-openapi.debank.com/v1/token/top_holders?id=${token}&chain_id=${chainId}&limit=${limit}`
			)
		);
		return data;
	}

	// biome-ignore lint/style/useNamingConvention: <explanation>
	async getAllNFTs(address: string) {
		const { data } = await firstValueFrom(
			this.httpService.get(
				`https://pro-openapi.debank.com/v1/user/all_nft_list?id=${address}&is_all=false`
			)
		);
		return data;
	}
	// biome-ignore lint/style/useNamingConvention: <explanation>
	async getNFTsByChain(address: string, chainId: string) {
		const { data } = await firstValueFrom(
			this.httpService.get(
				`https://pro-openapi.debank.com/v1/user/nft_list?id=${address}&chain_id=${chainId}`
			)
		);
		return data;
	}

	async getGasPrice(chainId: string) {
		const { data } = await firstValueFrom(
			this.httpService.get(
				`https://pro-openapi.debank.com/v1/wallet/gas_market?chain_id=${chainId}`
			)
		);
		return data;
	}

	async getTokenList(address: `0x${string}`, chainId: string) {
		const { data } = await firstValueFrom(
			this.httpService.get(
				`https://pro-openapi.debank.com/v1/user/token_list?id=${address}&chain_id=${chainId}`
			)
		);
		return data;
	}

	async getChainList() {
		type SupportedChain = {
			readonly id: string;
			readonly community_id: number;
			readonly name: string;
			readonly native_token_id: string;
			readonly logo_url: string;
			readonly wrapped_token_id: string;
			readonly is_support_pre_exec: boolean;
		};

		const { data } = await firstValueFrom(
			this.httpService.get("https://pro-openapi.debank.com/v1/chain/list")
		);
		return data as SupportedChain[];
	}
}

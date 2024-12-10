import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { FilterQuery, Model } from "mongoose";
import { TokenList, TokenListDocument } from "./schema/tokenList.schema";

@Injectable()
export class OpenOceanService {
	constructor(
		@InjectModel(TokenList.name)
		private tokenListModel: Model<TokenListDocument>
	) {}

	// @Cron("0 */3 * * * *")
	async syncTokenList() {
		const chains = [
			{
				code: "eth",
				id: 1,
			},
			{
				code: "bsc",
				id: 56,
			},
			{
				code: "avax",
				id: 43114,
			},
			{
				code: "polygon",
				id: 137,
			},
			{
				code: "arbitrum",
				id: 42161,
			},
			{
				code: "optimism",
				id: 10,
			},
			{
				code: "base",
				id: 8453,
			},
		] as const;
		type TokenList = {
			readonly id: number;
			readonly code: string;
			readonly name: string;
			readonly address: string;
			readonly decimals: number;
			readonly symbol: string;
			readonly icon: string;
			readonly chain: "bsc";
			readonly createtime: Date;
			readonly hot: "" | null;
			readonly sort: Date;
			readonly chainId: number | null;
			readonly customSymbol: null | string;
			readonly customAddress: null;
			readonly usd: string;
		};
		for (const chain of chains) {
			const updateOperations = [];
			const response = await fetch(
				`https://open-api.openocean.finance/v4/${chain.code}/tokenList`,
				{
					headers: {
						accept: "application/json",
						"accept-language": "en-US,en;q=0.9",
					},
					referrerPolicy: "strict-origin-when-cross-origin",
				}
			);
			if (response.ok) {
				const data = (await response.json()).data as TokenList[];
				data.forEach((token: any) => {
					updateOperations.push({
						updateOne: {
							filter: { address: token.address },
							update: {
								$set: {
									...token,
									provider: "open-ocean",
									chainId: chain.id,
								},
							},
							upsert: true,
						},
					});
				});
				await this.tokenListModel.bulkWrite(updateOperations);
			} else {
				throw new Error("Request failed with status " + response.status);
			}
		}
		console.log("TokenList updated");
	}

	async getTokenListByAddress(
		chainId: number,
		contractAddress: `0x${string}`[]
	) {
		return await this.tokenListModel
			.find({
				chainId,
				address: { $in: contractAddress },
			})
			.lean()
			.exec();
	}

	async getTokenListByQuery(
		chainId: number,
		query: FilterQuery<TokenListDocument>
	) {
		return await this.tokenListModel
			.find({ chainId, ...query })
			.lean()
			.exec();
	}
}

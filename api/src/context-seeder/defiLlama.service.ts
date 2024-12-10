import { createReadStream, writeFileSync } from "node:fs";
import * as path from "path";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import destr from "destr";
import { Model } from "mongoose";
import { $Fetch, ofetch } from "ofetch";
import { OpenAI } from "openai";
import { OldProtocols, Protocols } from "./defillama";
import { Context, ContextDocument } from "./entities/context.entity";
import { FieldMapping, convertArray } from "./helper";

@Injectable()
export class DefiLlamaService {
	private openai: OpenAI;
	fetch: $Fetch;
	constructor(
		private configService: ConfigService,
		@InjectModel(Context.name)
		private contextModel: Model<ContextDocument>
	) {
		this.fetch = ofetch.create({});
		this.openai = new OpenAI({ apiKey: configService.get("OPENAI_API_KEY") });
		// this.seed();
	}

	async seed() {
		await this.batching();
		// await this.deleteOldFiles();
	}

	@Cron(CronExpression.EVERY_2_HOURS)
	async batching() {
		// protocols
		const protocols = await this.fetch<any>(
			"https://api.llama.fi/protocols"
		);
		console.log(" Protocols Fetched");
		// const protocolFieldMapping: FieldMapping<OldProtocols, Protocols> = {
		// 	id: "protocolId",
		// 	name: "protocolName",
		// 	address: "contractAddress",
		// 	symbol: "tokenSymbol",
		// 	url: "websiteUrl",
		// 	description: "protocolDescription",
		// 	chain: "blockchainChain",
		// 	logo: "logoUrl",
		// 	audits: "auditStatus",
		// 	audit_note: "auditNote",
		// 	gecko_id: "coinGeckoId",
		// 	cmcId: "coinMarketCapId",
		// 	category: "categoryType",
		// 	chains: "supportedChains",
		// 	module: "moduleName",
		// 	twitter: "twitterHandle",
		// 	forkedFrom: "forkedFromProtocols",
		// 	oracles: "oracleServices",
		// 	listedAt: "listingDate",
		// 	methodology: "methodologyDescription",
		// 	slug: "slugIdentifier",
		// 	tvl: "totalValueLockedInUSD",
		// 	chainTvls: "chainTvlsInUSD",
		// 	change_1h: "change1Hour",
		// 	change_1d: "change1Day",
		// 	change_7d: "change7Days",
		// 	tokenBreakdowns: "tokenBreakdowns",
		// 	mcap: "marketCap",
		// };
		// console.log(destr(JSON.stringify(protocols)));
		// const typedProtocols: Protocols[] = convertArray(
		// 	protocols,
		// 	protocolFieldMapping
		// );
		const protocolJson = JSON.stringify(protocols, null, 2);
		writeFileSync(
			path.join(__dirname, "../../context-data/protocols.json"),
			protocolJson
		);
		console.log(" Protocols JSON Written");

		const protocol = await this.openai.files.create({
			file: createReadStream(
				path.join(__dirname, "../../context-data/protocols.json")
			),
			purpose: "assistants",
		});

		console.log(" Protocols Vector Store Created");

		const { peggedAssets } = await this.fetch(
			"https://stablecoins.llama.fi/stablecoins?includePrices=true"
		);
		console.log(" Stablecoins Fetched");
		const stableCoinJson = JSON.stringify(peggedAssets, null, 2);
		writeFileSync(
			path.join(__dirname, "../../context-data/stablecoins.json"),
			stableCoinJson
		);
		console.log(" Stablecoins JSON Written");
		const stableCoin = await this.openai.files.create({
			file: createReadStream(
				path.join(__dirname, "../../context-data/stablecoins.json")
			),
			purpose: "assistants",
		});

		console.log(" Stablecoins Vector Store Created");

		const { data: yields } = await this.fetch("https://yields.llama.fi/pools");

		console.log(" Yields Fetched");
		//FIXME split yields into 5 parts and save to files
		const yieldsJson = JSON.stringify(yields);
		writeFileSync(
			path.join(__dirname, "../../context-data/yields.json"),
			yieldsJson
		);
		console.log(" Yields JSON Written");
		// const yieldsFile = await this.openai.files.create({
		// 	file: createReadStream(
		// 		path.join(__dirname, "../../context-data/yields.json")
		// 	),
		// 	purpose: "assistants",
		// });
		// console.log(" Yields Vector Store Created");

		const { protocols: dexs } = await this.fetch(
			"https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume"
		);
		console.log(" Dexs Fetched");
		const dexsJson = JSON.stringify(dexs, null, 2);
		writeFileSync(
			path.join(__dirname, "../../context-data/dexs.json"),
			dexsJson
		);
		console.log(" Dexs JSON Written");
		const dexsFile = await this.openai.files.create({
			file: createReadStream(
				path.join(__dirname, "../../context-data/dexs.json")
			),
			purpose: "assistants",
		});

		console.log(" Dexs Vector Store Created");

		const { protocols: options } = await this.fetch(
			"https://api.llama.fi/overview/options?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyNotionalVolume"
		);
		console.log(" Options Fetched");
		const optionsJson = JSON.stringify(options, null, 2);
		writeFileSync(
			path.join(__dirname, "../../context-data/options.json"),
			optionsJson
		);
		console.log(" Options JSON Written");
		const optionsFile = await this.openai.files.create({
			file: createReadStream(
				path.join(__dirname, "../../context-data/options.json")
			),
			purpose: "assistants",
		});

		console.log(" Options Vector Store Created");

		const { protocols: feesAndRevenue } = await this.fetch(
			"https://api.llama.fi/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyFees"
		);

		console.log(" FeesAndRevenue Fetched");
		const feesAndRevenueJson = JSON.stringify(feesAndRevenue, null, 2);
		writeFileSync(
			path.join(__dirname, "../../context-data/feesAndRevenue.json"),
			feesAndRevenueJson
		);
		console.log(" FeesAndRevenue JSON Written");
		const feesAndRevenueFile = await this.openai.files.create({
			file: createReadStream(
				path.join(__dirname, "../../context-data/feesAndRevenue.json")
			),
			purpose: "assistants",
		});

		console.log(" FeesAndRevenue Vector Store Created");

		const batch = await this.openai.beta.vectorStores.create({
			name: "defillama-batch",
			expires_after: {
				days: 1,
				anchor: "last_active_at",
			},
			file_ids: [
				// protocol.id,
				stableCoin.id,
				dexsFile.id,
				optionsFile.id,
				feesAndRevenueFile.id,
				// yieldsFile.id,
			],
			// yields: `Retrieve the latest data for all pools, including enriched information such as predictions. fileID ${yieldsFile.id}`,
			metadata: {
				description:
					"DeFiLlama data pertaining to off-chain data of DeFi projects.",
				summary: `DeFiLlama data related to off-chain data of DeFi projects.
				the store contains the following files: protocols, stablecoins, dexs, options, and feesAndRevenue.
				`,
				// protocols: `A comprehensive list of all protocols on DeFiLlama, including their total value locked (TVL). File ID: ${protocol.id}`,
				stablecoins: `A detailed list of all stablecoins, including their circulating amounts and current prices. File ID: ${stableCoin.id}`,
				dexs: `A list of all decentralized exchanges (DEXs) with summaries of their trading volumes and historical data. File ID: ${dexsFile.id}`,
				options: `A list of all options DEXs with summaries of their trading volumes and historical data. File ID: ${optionsFile.id}`,
				feesAndRevenue: `A list of all protocols with summaries of their fees and revenue, along with historical data. File ID: ${feesAndRevenueFile.id}`,
			},
		});
		console.log("🚀 ~ DefiLlamaService ~ batching ~ batch:", batch);

		let context = await this.contextModel.findOne({
			name: "defillama",
		});

		if (!context) {
			context = await this.contextModel.create({
				name: "defillama",
				vectorId: batch.id,
			});
		}
		context.oldFiles = context.currentFiles;
		context.vectorId = batch.id;
		context.currentFiles = [
			protocol.id,
			stableCoin.id,
			dexsFile.id,
			optionsFile.id,
			feesAndRevenueFile.id,
			// yieldsFile.id,
		];
		await context.save();

		console.log("🚀 ~ DefiLlamaService ~ batching ~ currentFiles:", [
			protocol.id,
			stableCoin.id,
			dexsFile.id,
			optionsFile.id,
			feesAndRevenueFile.id,
			// yieldsFile.id,
		])
	}

	@Cron(CronExpression.EVERY_2_HOURS)
	async deleteOldFiles() {
		const context = await this.contextModel.findOne({
			name: "defillama",
		});
		const oldFiles = await this.openai.files.list();

		const filesToDelete = oldFiles.data.filter(
			(file) => !context.currentFiles.includes(file.id)
		);

		for (const fileId of filesToDelete) {
			await this.openai.files.del(fileId.id);
		}
	}

	@Cron(CronExpression.EVERY_2_HOURS)
	async deleteOldStores() {
		const vs = await this.openai.beta.vectorStores.list();
		const context = await this.contextModel.findOne({
			name: "defillama",
		});

		const filesToDelete = vs.data.filter(
			(file) => context.vectorId !== file.id
		);

		for (const file of filesToDelete) {
			await this.openai.beta.vectorStores.del(file.id);
		}
	}
}

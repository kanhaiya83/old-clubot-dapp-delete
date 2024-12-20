export type OldProtocols = {
	readonly id: string;
	readonly name: string;
	readonly address: null;
	readonly symbol: string;
	readonly url: string;
	readonly description: string;
	readonly chain: string;
	readonly logo: string;
	readonly audits: string;
	readonly audit_note: null;
	readonly gecko_id: null;
	readonly cmcId: null;
	readonly category: string;
	readonly chains: string[];
	readonly module: string;
	readonly twitter: string;
	readonly forkedFrom: any[];
	readonly oracles: any[];
	readonly listedAt: number;
	readonly methodology: string;
	readonly slug: string;
	readonly tvl: number;
	readonly chainTvls: { [key: string]: number };
	readonly change_1h: number;
	readonly change_1d: number;
	readonly change_7d: number;
	readonly tokenBreakdowns: object;
	readonly mcap: null;
};

export type Protocols = {
	readonly protocolId: string;
	readonly protocolName: string;
	readonly contractAddress: null;
	readonly tokenSymbol: string;
	readonly websiteUrl: string;
	readonly protocolDescription: string;
	readonly blockchainChain: string;
	readonly logoUrl: string;
	readonly auditStatus: string;
	readonly auditNote: null;
	readonly coinGeckoId: null;
	readonly coinMarketCapId: null;
	readonly categoryType: string;
	readonly supportedChains: string[];
	readonly moduleName: string;
	readonly twitterHandle: string;
	readonly forkedFromProtocols: any[];
	readonly oracleServices: any[];
	readonly listingDate: number;
	readonly methodologyDescription: string;
	readonly slugIdentifier: string;
	readonly totalValueLockedInUSD: number;
	readonly chainTvlsInUSD: { [key: string]: number };
	readonly change1Hour: number;
	readonly change1Day: number;
	readonly change7Days: number;
	readonly tokenBreakdowns: object;
	readonly marketCap: null;
};

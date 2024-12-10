export type DeFiLlama = {
	readonly id: string
	readonly name: string
	readonly address: null
	readonly symbol: string
	readonly url: string
	readonly description: string
	readonly chain: string
	readonly logo: string
	readonly audits: string
	readonly audit_note: null
	readonly gecko_id: null
	readonly cmcId: null
	readonly category: string
	readonly chains: string[]
	readonly module: string
	readonly twitter: string
	readonly forkedFrom: any[]
	readonly oracles: any[]
	readonly listedAt: number
	readonly methodology: string
	readonly slug: string
	readonly tvl: number
	readonly chainTvls: { [key: string]: number }
	readonly change_1h: number
	readonly change_1d: number
	readonly change_7d: number
	readonly tokenBreakdowns: object
	readonly mcap: null
}

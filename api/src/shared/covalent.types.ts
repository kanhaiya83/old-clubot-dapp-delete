export type CovalentRes = {
	readonly data: Data;
	readonly error: boolean;
	readonly error_message: null;
	readonly error_code: null;
}

export type Data = {
	readonly address: `${string}`;
	readonly updated_at: Date;
	readonly next_update_at: Date;
	readonly quote_currency: string;
	readonly chain_id: number;
	readonly chain_name: string;
	readonly items: Item[];
	readonly pagination: null;
}

export type Item = {
	readonly contract_decimals: number | null;
	readonly contract_name: string;
	readonly contract_ticker_symbol: string;
	readonly contract_address: string;
	readonly supports_erc: SupportsErc[] | null;
	readonly logo_url: string;
	readonly contract_display_name: string;
	readonly logo_urls: LogoUrls;
	readonly last_transferred_at: Date;
	readonly native_token: boolean;
	readonly type: Type;
	readonly is_spam: boolean;
	readonly balance: string;
	readonly balance_24h: string;
	readonly quote_rate: number | null;
	readonly quote_rate_24h: number | null;
	readonly quote: number | null;
	readonly pretty_quote: null | string;
	readonly quote_24h: number | null;
	readonly pretty_quote_24h: null | string;
	readonly protocol_metadata: null;
	readonly nft_data: NftDatum[] | null;
}

export type LogoUrls = {
	readonly token_logo_url: string;
	readonly protocol_logo_url: null;
	readonly chain_logo_url: string;
}

export type NftDatum = {
	readonly token_id: string;
	readonly token_balance: null | string;
	readonly token_url: null | string;
	readonly supports_erc: SupportsErc[] | null;
	readonly token_price_wei: null;
	readonly token_quote_rate_eth: null;
	readonly original_owner: `${string}` | null;
	readonly current_owner: null;
	readonly external_data: ExternalData | null;
	readonly owner: null;
	readonly owner_address: null;
	readonly burned: null;
}

export type ExternalData = {
	readonly name: string;
	readonly description: null | string;
	readonly image: string;
	readonly image_256: null | string;
	readonly image_512: null | string;
	readonly image_1024: null | string;
	readonly animation_url: null | string;
	readonly external_url: null | string;
	readonly attributes: Attribute[] | null;
	readonly owner: null;
}

export type Attribute = {
	readonly value: Value;
	readonly trait_type: string;
	readonly display_type?: string;
}

export type Value = boolean | number | string;

export type SupportsErc = "erc20" | "erc165" | "erc721" | "erc1155";

export type Type = "cryptocurrency" | "dust" | "nft";

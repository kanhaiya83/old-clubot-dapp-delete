import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MonSchema } from "mongoose";

export type TokenListDocument = TokenList & Document;

@Schema({ timestamps: true })
export class TokenList {
	@Prop({ required: true })
	provider: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	address: string;

	@Prop({ required: true })
	decimals: number;

	@Prop({ required: true })
	symbol: string;

	@Prop({ required: true })
	icon: string;

	@Prop({ required: true })
	chain: "eth" | "bsc" | "avax" | "polygon" | "arbitrum" | "optimism" | "base";

	@Prop({ required: true })
	chainId: number;

	@Prop({ required: true })
	usd: string;
}

export const TokenListSchema = SchemaFactory.createForClass(TokenList);

TokenListSchema.index({ chain: 1, address: 1 }, { unique: true });

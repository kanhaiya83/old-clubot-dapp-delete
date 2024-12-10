import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ActivityDocument = Activity & Document
// export class CreateSwapDto {
//     txHash: string;
//     valueAinUSD: number;
//     valueBinUSD: number;
// }

@Schema({ timestamps: true })
export class Activity {
	@Prop({ required: true })
	user: Types.ObjectId

	@Prop({ required: true, enum: ['swap', 'transfer'] })
	type: 'swap' | 'transfer'

	@Prop({ required: false })
	tokenName: string

	@Prop({ required: false })
	tokenAddress: string

	@Prop({ required: false })
	to: `0x${string}`

	@Prop({ required: false })
	amount: number

	@Prop({ required: false, type: [String]})
	txHash: `0x${string}`[]

	@Prop({ required: false })
	valueInUSD: number

	@Prop({ required: false })
	tokenAName: string

	@Prop({ required: false })
	tokenBName: string

	@Prop({ required: false })
	tokenAAddress: `0x${string}`

	@Prop({ required: false })
	tokenBAddress: `0x${string}`

	@Prop({ required: false })
	amountA: number

	@Prop({ required: false })
	amountB: number

	@Prop({ required: false })
	valueAinUSD: number

	@Prop({ required: false })
	valueBinUSD: number
}

export const ActivitySchema = SchemaFactory.createForClass(Activity)

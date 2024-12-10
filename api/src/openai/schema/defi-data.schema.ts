import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MonSchema } from 'mongoose'

export type DefiDataDocument = DefiData & Document

@Schema({ timestamps: true })
export class DefiData {
	@Prop({ required: true })
	site: string

	@Prop({ required: true })
	type: string

	@Prop({ required: true })
	defiId: string

	@Prop({ type: Map, of: MonSchema.Types.Mixed }) // Store dynamic key-value pairs
	data: Map<string, any>
}

export const DefiDataSchema = SchemaFactory.createForClass(DefiData)

DefiDataSchema.index({ site: 1, type: 1, defiId: 1 }, { unique: true })

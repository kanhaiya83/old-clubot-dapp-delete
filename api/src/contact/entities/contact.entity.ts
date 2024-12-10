import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ContactDocument = Contact & Document

@Schema({ timestamps: true })
export class Contact {
	@Prop({ required: true })
	name: string

	@Prop({ required: false })
	description: string

	@Prop({ required: true })
	address: `0x${string}`

	@Prop({ required: true, type: Types.ObjectId, ref: 'User' })
	user: Types.ObjectId
}

export const ContactSchema = SchemaFactory.createForClass(Contact)

ContactSchema.index({ user: 1, address: 1 }, { unique: true })

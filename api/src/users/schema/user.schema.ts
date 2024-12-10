import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { hash } from 'ohash'

export type UserDocument = User & Document
export type ReqUser = {
	address: `0x${string}`
	id: string
}
@Schema({})
export class User {
	@Prop({ required: true, unique: true, index: true })
	address: `0x${string}`

	@Prop({ required: false, index: true })
	referral: string

	@Prop({ required: false, type: Types.ObjectId, ref: 'User' })
	referrer: UserDocument | Types.ObjectId
}

export const UserSchema = SchemaFactory.createForClass(User)

// add pre save hook to user schema to add referral code

UserSchema.pre('save', async function (next) {
	const user = this as UserDocument
	if (!user.referral) {
		user.referral = hash(user.address).toUpperCase().slice(0, 6)
	}
	next()
})

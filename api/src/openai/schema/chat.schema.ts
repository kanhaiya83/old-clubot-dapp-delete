import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
	user: Types.ObjectId;

	@Prop({ required: true })
	threadId: string;

	@Prop({ default: "" })
	title: string;

	@Prop({ type: [String], default: [] })
	messages: string[];

	@Prop({ default: Date.now })
	createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

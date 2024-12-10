import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ContextDocument = Context & Document;

@Schema({ timestamps: true })
export class Context {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	vectorId: string;

	@Prop({ required: true })
	currentFiles: string[];

	@Prop({ required: true })
	oldFiles: string[];
}

export const ContextSchema = SchemaFactory.createForClass(Context);

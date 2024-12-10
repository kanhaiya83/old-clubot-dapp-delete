import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DefiLlamaService } from "./defiLlama.service";
import { Context, ContextSchema } from "./entities/context.entity";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Context.name, schema: ContextSchema }]),
	],
	providers: [DefiLlamaService],
})
export class ContextSeederModule { }

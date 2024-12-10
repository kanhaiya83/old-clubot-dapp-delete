import { Module } from "@nestjs/common";
import { AssistantService } from "./assistant.service";
import { AssistantController } from "./assistant.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
	Context,
	ContextSchema,
} from "src/context-seeder/entities/context.entity";
import { UsersModule } from "src/users/users.module";
import { ChatService } from "src/openai/chat.service";
import { Chat, ChatSchema } from "src/openai/schema/chat.schema";
import { ContactModule } from "src/contact/contact.module";
import { DeFiCronService } from "src/openai/defi-cron.service";
import { SharedModule } from "src/shared/shared.module";
import { DefiData, DefiDataSchema } from "src/openai/schema/defi-data.schema";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [
		SharedModule,
		HttpModule,
		ContactModule,
		UsersModule,
		MongooseModule.forFeature([
			{ name: Context.name, schema: ContextSchema },
			{ name: DefiData.name, schema: DefiDataSchema },
			{ name: Chat.name, schema: ChatSchema },
		]),
	],
	controllers: [AssistantController],
	providers: [AssistantService, ChatService, DeFiCronService],
})
export class AssistantModule {}

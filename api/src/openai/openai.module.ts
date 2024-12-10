import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { ContactModule } from "src/contact/contact.module";
import { SharedModule } from "src/shared/shared.module";
import { UsersModule } from "src/users/users.module";
import { ChatService } from "./chat.service";
import { DeFiCronService } from "./defi-cron.service";
import { OpenAiController } from "./openai.controller";
import { OpenAiService } from "./openai.service";
import { Chat, ChatSchema } from "./schema/chat.schema";
import { DefiData, DefiDataSchema } from "./schema/defi-data.schema";
import { TokenList, TokenListSchema } from "./schema/tokenList.schema";
import { OpenOceanService } from "./open-ocean.service";

@Module({
	imports: [
		HttpModule,
		SharedModule,
		MongooseModule.forFeature([
			{ name: Chat.name, schema: ChatSchema },
			{ name: DefiData.name, schema: DefiDataSchema },
			{ name: TokenList.name, schema: TokenListSchema },
		]),
		UsersModule,
		AuthModule,
		ContactModule,
	],
	controllers: [OpenAiController],
	providers: [OpenAiService, ChatService, DeFiCronService, OpenOceanService],
	exports: [OpenAiService, ChatService],
})
export class OpenAiModule {}

import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
} from "@nestjs/common";
import { Model, Types } from "mongoose";
import { Authenticated } from "src/auth/auth.decorator";
import { DebankService } from "../shared/debank.service";
import { ChatService } from "./chat.service";
import { DeFiCronService } from "./defi-cron.service";
import { OpenAiService } from "./openai.service";
import { Chat } from "./schema/chat.schema";
import { UserInfo } from "src/auth/user.decorator";
import { ReqUser } from "src/users/schema/user.schema";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("OpenAI")
@Controller("openai")
export class OpenAiController {
	constructor(
		private readonly openAiService: OpenAiService,
		private chatService: ChatService,
		private cron: DeFiCronService,
		private debankService: DebankService
	) {}

	@Get("chats")
	@Authenticated()
	async getUserChats(@Req() req): Promise<Chat[]> {
		const userId: string = req.user.id;
		return this.chatService.getUserChats(new Types.ObjectId(userId));
	}

	@Get("chats/:chatId")
	@Authenticated()
	async getChat(@Param("chatId") chatId: string): Promise<Chat> {
		return this.chatService.getChatById(chatId);
	}

	@Post("chat")
	@Authenticated()
	async chat(
		@Body()
		chatDto: {
			message: string;
			chatId?: string;
			chainId?: number;
			role?: string;
		},
		@Req() req: { user: any }
	) {
		return this.openAiService.chat(
			chatDto.message,
			req.user.id,
			chatDto.chatId,
			chatDto.role,
			chatDto.chainId
		);
	}

	@Delete("chat/:chatId")
	@Authenticated()
	async deleteChat(
		@UserInfo() userInfo: ReqUser,
		@Param("chatId") chatId: string
	): Promise<any> {
		return await this.chatService.deleteChat(userInfo, chatId);
	}

	@Post("defillama")
	async defiLlamaData(): Promise<any> {
		return this.cron.defillamaProtocolsCron();
	}

	@Get("defillama")
	async searchDefiData(): Promise<any> {
		return this.cron.searchOnDefiData("defillama", "protocol", {
			"data.id": "2269",
		});
	}

	@Get("coingecko")
	async searchCoinGecko(): Promise<any> {
		return this.cron.fetchDefiDataByAddress(
			"arbitrum",
			"0x6f8a06447ff6fcf75d803135a7de15ce88c1d4ec"
		);
	}
}

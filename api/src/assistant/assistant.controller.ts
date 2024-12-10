import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
} from "@nestjs/common";
import { AssistantService } from "./assistant.service";
import { Types } from "mongoose";
import { Chat } from "openai/resources";
import { Authenticated } from "src/auth/auth.decorator";
import { UserInfo } from "src/auth/user.decorator";
import { ReqUser } from "src/users/schema/user.schema";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Assistant")
@Controller("assistant")
export class AssistantController {
	constructor(private readonly assistantService: AssistantService) {}

	@Get("chats")
	@Authenticated()
	async getUserChats(@Req() req): Promise<Chat[]> {
		const userId: string = req.user.id;
		return this.assistantService.getUserChats(new Types.ObjectId(userId));
	}

	@Get("chats/:chatId")
	@Authenticated()
	async getChat(@Param("chatId") chatId: string): Promise<Chat> {
		return this.assistantService.getChatById(chatId);
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
		return this.assistantService.chat(
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
		return await this.assistantService.deleteChat(userInfo, chatId);
	}
}

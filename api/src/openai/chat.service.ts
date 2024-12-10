import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Chat, ChatDocument } from "./schema/chat.schema";
import { ReqUser } from "src/users/schema/user.schema";

@Injectable()
export class ChatService {
	constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

	async createChat2(
		userId: Types.ObjectId,
		chatId: string,
		title: string
	): Promise<ChatDocument> {
		const createdChat = new this.chatModel({
			user: userId,
			title,
			threadId: chatId,
		});
		const chat = await createdChat.save();
		return chat;
	}

	async createChat(userId: Types.ObjectId, title: string): Promise<string> {
		const createdChat = new this.chatModel({
			user: userId,
			messages: [],
			title,
		});
		const chat = await createdChat.save();
		return chat.id;
	}

	async getChatById(chatId: string): Promise<ChatDocument> {
		return this.chatModel.findById(chatId).exec();
	}

	async addMessageToChat(
		chatId: string,
		message: { role: string; content: string; extra?: object }
	): Promise<Chat> {
		return this.chatModel
			.findByIdAndUpdate(
				chatId,
				{ $push: { messages: message } },
				{ new: true }
			)
			.exec();
	}

	async getUserChats(userId: Types.ObjectId): Promise<Chat[]> {
		return this.chatModel
			.find({ user: userId })
			.sort({ createdAt: -1 })
			.select({ id: 1, title: 1, chatId: 1, createdAt: 1 })
			.exec();
	}

	async deleteChat(userInfo: ReqUser, chatId: string) {
		const chat = await this.chatModel
			.findOne({ user: userInfo.id, _id: chatId })
			.exec();

		if (!chat) {
			throw new Error("Chat not found");
		}

		return await this.chatModel.findByIdAndDelete(chatId).exec();
	}
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ReqUser } from "src/users/schema/user.schema";
import { UsersService } from "src/users/users.service";
import { CreateSwapDto, CreateTransferDto } from "./activity.dto";
import { Activity, ActivityDocument } from "./activity.schema";
import { ofetch } from "ofetch";

@Injectable()
export class ActivityService {
	constructor(
		private usersService: UsersService,
		@InjectModel(Activity.name) private activityModel: Model<ActivityDocument>
	) {}
	async createTransfer(
		userInfo: ReqUser,
		createActivityDto: CreateTransferDto
	) {
		const user = await this.usersService.findById(userInfo.id);
		const activity = new this.activityModel({
			...createActivityDto,
			type: "transfer",
			user: user.id,
		});
		return await activity.save();
	}
	async createSwap(userInfo: ReqUser, createActivityDto: CreateSwapDto) {
		const user = await this.usersService.findById(userInfo.id);
		const activity = new this.activityModel({
			...createActivityDto,
			type: "swap",
			user: user.id,
		});
		return await activity.save();
	}
	async findAll(
		userInfo: ReqUser,
		type: ("swap" | "transfer")[],
		page = 1,
		limit = 20
	) {
		return await this.activityModel
			.find({ user: userInfo.id, type: { $in: type } })
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();
	}

	async getGasPrice(chainId: string) {
		type OtherGasPrice = {
			readonly standard: number;
			readonly fast: number;
			readonly instant: number;
		};
		type ETHGasPrice = {
			readonly base: number;
			readonly standard: Fast;
			readonly fast: Fast;
			readonly instant: Fast;
		};
		type Fast = {
			readonly legacyGasPrice: number;
			readonly maxPriorityFeePerGas: number;
			readonly maxFeePerGas: number;
		};

		const { without_decimals } = await ofetch(
			`https://open-api.openocean.finance/v3/${chainId}/gasPrice`,
			{
				headers: {
					accept: "application/json",
					"accept-language": "en-US,en;q=0.9",
				},
				referrerPolicy: "strict-origin-when-cross-origin",
			}
		);
		let gasPrice: OtherGasPrice;
		if (chainId === "eth") {
			const data = without_decimals as ETHGasPrice;
			gasPrice = {
				standard: data.standard.maxFeePerGas,
				fast: data.fast.maxFeePerGas,
				instant: data.instant.maxFeePerGas,
			};
		} else {
			const data = without_decimals as OtherGasPrice;
			gasPrice = {
				standard: data.standard,
				fast: data.fast,
				instant: data.instant,
			};
		}
		return gasPrice;
	}
	async ooSwap(
		chain: string,
		inTokenAddress: string,
		outTokenAddress: string,
		amount: string,
		slippage: string,
		gasPrice: string,
		account: string
	) {
		try {
			const { data } = await ofetch(
				`https://open-api.openocean.finance/v3/${chain}/swap_quote?inTokenAddress=${inTokenAddress}&outTokenAddress=${outTokenAddress}&amount=${amount}&slippage=${slippage}&gasPrice=${gasPrice}&account=${account}`,
				{
					headers: {
						accept: "application/json",
						"accept-language": "en-US,en;q=0.9",
					},
					referrerPolicy: "strict-origin-when-cross-origin",
				}
			);
			if (data) {
				return data;
			} else {
				throw new Error("Request failed with status " + data);
			}
		} catch (error) {
			console.error("Error in ooSwap:", error);
			throw error;
		}
	}
}

import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Authenticated } from "src/auth/auth.decorator";
import { UserInfo } from "src/auth/user.decorator";
import { ReqUser } from "src/users/schema/user.schema";
import { CreateSwapDto, CreateTransferDto } from "./activity.dto";
import { ActivityService } from "./activity.service";

@Controller("activity")
export class ActivityController {
	constructor(private readonly activityService: ActivityService) {}

	@Post("swap")
	@Authenticated()
	async create(
		@UserInfo() user: ReqUser,
		@Body() createActivityDto: CreateSwapDto
	) {
		return this.activityService.createSwap(user, createActivityDto);
	}

	@Post("transfer")
	@Authenticated()
	async transfer(
		@UserInfo() user: ReqUser,
		@Body() createActivityDto: CreateTransferDto
	) {
		return this.activityService.createTransfer(user, createActivityDto);
	}

	@Get()
	@Authenticated()
	async findAll(
		@UserInfo() user: ReqUser,
		@Query("type") type: ("swap" | "transfer")[],
		@Query("page") page = 1,
		@Query("limit") limit = 10
	) {
		return this.activityService.findAll(user, type, page, limit);
	}

	@Get("gasPrice")
	@Authenticated()
	async getGasPrice(@Query("chainId") chainId: string) {
		return await this.activityService.getGasPrice(chainId);
	}

	@Get("oo-swap")
	// @Authenticated()
	async ooSwap(
		@Query("chain") chain: string,
		@Query("inTokenAddress") inTokenAddress: string,
		@Query("outTokenAddress") outTokenAddress: string,
		@Query("amount") amount: string,
		@Query("slippage") slippage: string,
		@Query("gasPrice") gasPrice: string,
		@Query("account") account: string
	) {
		// Call the appropriate service method here
		return await this.activityService.ooSwap(
			chain,
			inTokenAddress,
			outTokenAddress,
			amount,
			slippage,
			gasPrice,
			account
		);
	}
}

import { Controller, Get } from "@nestjs/common";
import { CovalentService } from "./covalenthq.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("test")
@Controller("test")
export class TestController {
	constructor(private readonly covalentService: CovalentService) {}

	@Get("token-balances")
	async getTokenBalances() {
		return await this.covalentService.getTokenBalancesForWalletAddress({
			chainId: 137,
			userAddress: "0xAbb6c94E23cdA58BfB0ee135Eb974fAC4D0afcA7",
		});
	}
}

import { Injectable } from '@nestjs/common'
import { DebankService } from 'src/shared/debank.service'

@Injectable()
export class ContextService {
	constructor(private readonly debankService: DebankService) {}
	async getChains() {
		const chains = await this.debankService.getChainList()
		const supportedChains = [1, 137, 56, 42161, 43114, 10, 250, 100, 8453]
		return chains.filter(chain => supportedChains.includes(chain.community_id))
	}
}

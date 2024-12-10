import { Controller, Get, Param } from '@nestjs/common'
import { Authenticated } from 'src/auth/auth.decorator'
import { UserInfo } from 'src/auth/user.decorator'
import { ReqUser } from './schema/user.schema'
import { UsersService } from './users.service'

@Controller('user')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	getHello(): string {
		return 'Hello World!'
	}

	@Get('token-list/:chain_id')
	@Authenticated()
	async getTokenList(
		@UserInfo() user: ReqUser,
		@Param('chain_id') chainId: string,
	) {
		return await this.usersService.getTokenList(user, chainId)
	}

	@Get('me')
	@Authenticated()
	async me(@UserInfo() user: ReqUser) {
		return await this.usersService.findById(user.id)
	}

	@Get('referrals')
	@Authenticated()
	async getReferralList(@UserInfo() user: ReqUser) {
		return await this.usersService.getReferralList(user)
	}
}

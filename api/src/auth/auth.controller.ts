import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { Authenticated } from './auth.decorator'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(
		@Body()
		loginDto: {
			address: `0x${string}`
			signature: `0x${string}`
			message: string
			referralCode?: string
		},
	) {
		return this.authService.login(
			loginDto.address,
			loginDto.signature,
			loginDto.message,
			loginDto.referralCode,
		)
	}

	@Get('me')
	@Authenticated()
	async me(@Req() req: { user: any }) {
		return req.user
	}
}

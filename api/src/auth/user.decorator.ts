import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { ReqUser } from 'src/users/schema/user.schema'

export const UserInfo = createParamDecorator<ReqUser>(
	async (data: unknown, ctx: ExecutionContext): Promise<ReqUser> => {
		const { user } = ctx.switchToHttp().getRequest()
		return user
	},
)

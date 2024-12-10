import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from './auth.guard'

export const IS_AUTHENTICATED_KEY = 'isAuthenticated'
export const Authenticated = () =>
	applyDecorators(SetMetadata(IS_AUTHENTICATED_KEY, true), UseGuards(AuthGuard))

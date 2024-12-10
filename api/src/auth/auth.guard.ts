import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private jwtService: JwtService, // You'll need your AuthService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const token = request.headers.authorization?.split(' ')[1] // Extract JWT

		if (!token) {
			return false // No token, deny access
		}

		try {
			const payload = await this.jwtService.verify(token) // Verify JWT
			request.user = payload // Attach user info to request for later use
			return true // Valid token, allow access
		} catch (error) {
			return false // Invalid token, deny access
		}
	}
}

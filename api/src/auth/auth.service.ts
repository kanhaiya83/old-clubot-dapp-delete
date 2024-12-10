import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { isEmpty } from 'radash'
import { UsersService } from 'src/users/users.service'
import { http, createPublicClient, hashMessage, recoverMessageAddress } from 'viem'
import { mainnet, polygon } from 'viem/chains'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) { }


	async getSigner(message, signature) {
		const messageHash = hashMessage(message);
		const signerAddress = await recoverMessageAddress({
		 message:{raw: messageHash},
		  signature
		});
		return signerAddress;
	  }

	async validateSignature(
		address: `0x${string}`,
		signature: `0x${string}`,
		message: string,
	): Promise<any> {
		const client = createPublicClient({
			chain: polygon,
			transport: http(),
		})
		const addressFromSignature = await this.getSigner(message, signature)
		console.log('signature: ',addressFromSignature)
		const result = await client.verifyMessage({
			address,
			signature,
			message,
		})
		return {result,addressFromSignature}
	}

	async login(
		address: `0x${string}`,
		signature: `0x${string}`,
		message: string,
		referralCode?: string,
	) {
		// Validate the signature
		try {
			const isValid = await this.validateSignature(address, signature, message)
			if (isValid.result) {
				const referrer = !isEmpty(referralCode)
					? await this.usersService.findByReferralCode(referralCode)
					: null
				let user = await this.usersService.findByAddress(address)
				if (!user) {
					user = await this.usersService.create({
						address,
						referrer,
						referral: '',
					})
				}
				const payload = { address: user.address, id: user.id } // JWT payload
				return {
					// biome-ignore lint/style/useNamingConvention: <explanation>
					access_token: this.jwtService.sign(payload),
					isValid: true,
				}
			}
			return { isValid: false, error: 'Invalid signature', addressFromSignature: isValid.addressFromSignature }
		} catch (error) {
			return { isValid: false, error: error.message}
		}
	}

	async verifyToken(token: string) {
		return this.jwtService.verify(token)
	}
}

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { DebankService } from 'src/shared/debank.service'
import { ReqUser, User, UserDocument } from './schema/user.schema'

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,
		private readonly debankService: DebankService,
	) { }

	async getTokenList(user: ReqUser, chainId: string) {
		const chainToCoinIdMap = {
			ethereum: 'eth',
			'binance-smart-chain': 'bsc',
			avalanche: 'avax',
			'polygon-pos': 'matic',
			'arbitrum-one': 'arb',
			'optimistic-ethereum': 'op',
			base: 'ethereum',
		}
		const chainIdVal = await chainToCoinIdMap[chainId] || chainId
		console.log("🚀 ~ UsersService ~ getTokenList ~ chainIdVal:", chainIdVal)
		return await this.debankService.getTokenList(user.address, chainIdVal)
	}

	async findByAddress(address: string): Promise<UserDocument> {
		return await this.userModel.findOne({ address }).exec()
	}

	async findByReferralCode(code: string): Promise<UserDocument> {
		return await this.userModel
			.findOne({
				referral: code,
			})
			.exec()
	}

	async findById(id: string): Promise<UserDocument> {
		return await this.userModel.findById(id).exec()
	}

	async create(createUserDto: User): Promise<UserDocument> {
		const createdUser = new this.userModel(createUserDto)
		return createdUser.save()
	}

	async getReferralList(user: ReqUser) {
		const referrals = await this.userModel.find({ referrer: new Types.ObjectId(user.id) }).exec()
		return referrals
	}
}

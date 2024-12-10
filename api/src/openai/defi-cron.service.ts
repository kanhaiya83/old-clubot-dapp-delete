import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Model } from 'mongoose'
import { mapEntries } from 'radash'
import { firstValueFrom } from 'rxjs'
import { DefiData, DefiDataDocument } from './schema/defi-data.schema'
import { DeFiLlama } from './types/defillama'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DeFiCronService {
	constructor(
		@InjectModel(DefiData.name)
		private defiDataModel: Model<DefiDataDocument>,
		private readonly httpService: HttpService,
		private configService: ConfigService,
	) {
		httpService.axiosRef.defaults.headers.accept = 'application/json'
	}

	async fetchDefillamaProtocols() {
		const { data } = await firstValueFrom(
			this.httpService.get('https://api.llama.fi/protocols'),
		)
		return data as DeFiLlama[]
	}

	async fetchCoinGeckoTokens() {
		try {
			const { data } = await firstValueFrom(
				this.httpService.get(
					'https://pro-api.coingecko.com/api/v3/coins/list?include_platform=true',
					{
						headers: {
							'x-cg-pro-api-key': this.configService.get('COINGECKO_API_KEY'),
						},
					},
				)
			)
			return data
		} catch (error) {
			console.log("🚀 ~ DeFiCronService ~ fetchCoinGeckoTokens ~ error:", error)

		}
	}

	async fetchCoinGeckoTokenById(id: string) {
		const { data } = await firstValueFrom(
			this.httpService.get(
				`https://pro-api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=true&developer_data=true&sparkline=false`,
				{
					headers: {
						'x-cg-pro-api-key': this.configService.get('COINGECKO_API_KEY'),
					},
				},
			),
		)
		return data
	}

	async fetchDefiDataByAddress(id: string, address: string) {
		try {
			const { data } = await firstValueFrom(
				this.httpService.get(
					`https://pro-api.coingecko.com/api/v3/coins/${id}?localization=false&market_data=true`,
					{
						headers: {
							'x-cg-pro-api-key': this.configService.get('COINGECKO_API_KEY'),
						},
					},
				),
			)
			return data
		} catch (error) {
			console.log("🚀 ~ DeFiCronService ~ fetchDefiDataByAddress ~ error:", error)

		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async defillamaProtocolsCron() {
		console.log('Running DeFi Llama Protocols cron job')
		const defiDataProtocol = await this.fetchDefillamaProtocols()
		console.log('DefiLlama data Length', defiDataProtocol.length)
		const coinGeckoTokens = await this.fetchCoinGeckoTokens()
		console.log('CoinGecko data Length', coinGeckoTokens.length)
		const updateOperations = []
		for (const protocol of defiDataProtocol) {
			const mapData = new Map(Object.entries(protocol) as [string, any][])
			const data = {
				updateOne: {
					filter: { site: 'defillama', type: 'protocol', defiId: protocol.id },
					update: {
						site: 'defillama',
						type: 'protocol',
						defiId: protocol.id,
						data: mapData,
					},
					upsert: true,
				},
			}
			updateOperations.push(data)
		}
		for (const token of coinGeckoTokens) {
			const mapData = new Map(Object.entries(token) as [string, any][])
			const data = {
				updateOne: {
					filter: { site: 'coingecko', type: 'token', defiId: token.id },
					update: {
						site: 'coingecko',
						type: 'token',
						defiId: token.id,
						data: mapData,
					},
					upsert: true,
				},
			}
			updateOperations.push(data)
		}
		await this.defiDataModel.bulkWrite(updateOperations)
		console.log('DeFi Llama Protocols cron job completed')
	}

	async searchOnDefiData(
		site: string,
		type: string,
		query: object,
	): Promise<DefiDataDocument[]> {
		return this.defiDataModel.find({
			site: site,
			type: type,
			...query,
		})
	}
}

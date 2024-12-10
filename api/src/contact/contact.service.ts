import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UsersService } from 'src/users/users.service'
import { ReqUser } from '../users/schema/user.schema'
import { CreateContactDto } from './dto/create-contact.dto'
import { UpdateContactDto } from './dto/update-contact.dto'
import { Contact, ContactDocument } from './entities/contact.entity'

@Injectable()
export class ContactService {
	constructor(
		private usersService: UsersService,
		@InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
	) { }

	async create(userDta: ReqUser, createContactDto: CreateContactDto) {
		const existingContact = await this.contactModel
			.findOne({ user: userDta.id, address: createContactDto.address })
			.exec()
		if (existingContact) {
			throw new Error('Contact already exists')
		}
		const contact = new this.contactModel({
			...createContactDto,
			user: userDta.id,
		})
		return await contact.save()
	}

	async findAll(userDta: ReqUser) {
		return await this.contactModel.find({ user: userDta.id }).exec()
	}

	async findAllBySearchKey(userDta: ReqUser, searchKey: string) {
		return await this.contactModel
			.find({
				user: userDta.id,
				$or: [
					{ name: { $regex: searchKey, $options: 'i' } },
					{ address: { $regex: searchKey, $options: 'i' } },
				],
			})
			.exec()
	}

	async findOne(userDta: ReqUser, id: string) {
		const contact = await this.contactModel
			.findOne({ user: userDta.id, _id: id })
			.exec()
		if (!contact) {
			throw new Error('Contact not found')
		}
		return contact
	}

	async update(
		userDta: ReqUser,
		id: string,
		updateContactDto: UpdateContactDto,
	) {
		const contact = await this.contactModel
			.findOne({ user: userDta.id, _id: id })
			.exec()
		if (!contact) {
			throw new Error('Contact not found')
		}
		return await this.contactModel
			.findByIdAndUpdate(
				id,
				{ ...updateContactDto, user: userDta.id },
				{ new: true },
			)
			.exec()
	}

	async remove(userDta: ReqUser, id: string) {
		const contact = await this.contactModel
			.findOne({ user: userDta.id, _id: id })
			.exec()
		if (!contact) {
			throw new Error('Contact not found')
		}
		return await this.contactModel.findByIdAndDelete(id).exec()
	}
}

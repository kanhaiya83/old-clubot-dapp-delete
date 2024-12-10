import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { Authenticated } from 'src/auth/auth.decorator'
import { UserInfo } from 'src/auth/user.decorator'
import { ReqUser } from '../users/schema/user.schema'
import { ContactService } from './contact.service'
import { CreateContactDto } from './dto/create-contact.dto'
import { UpdateContactDto } from './dto/update-contact.dto'

@Controller('contact')
export class ContactController {
	constructor(private readonly contactService: ContactService) {}

	@Post()
	@Authenticated()
	create(
		@UserInfo() user: ReqUser,
		@Body() createContactDto: CreateContactDto,
	) {
		return this.contactService.create(user, createContactDto)
	}

	@Get()
	@Authenticated()
	findAll(@UserInfo() user: ReqUser) {
		return this.contactService.findAll(user)
	}

	@Get(':id')
	@Authenticated()
	findOne(@UserInfo() user: ReqUser, @Param('id') id: string) {
		return this.contactService.findOne(user, id)
	}

	@Patch(':id')
	@Authenticated()
	update(
		@UserInfo() user: ReqUser,
		@Param('id') id: string,
		@Body() updateContactDto: UpdateContactDto,
	) {
		return this.contactService.update(user, id, updateContactDto)
	}

	@Delete(':id')
	@Authenticated()
	remove(@UserInfo() user: ReqUser, @Param('id') id: string) {
		return this.contactService.remove(user, id)
	}
}

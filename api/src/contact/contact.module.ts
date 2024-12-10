import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { ContactController } from './contact.controller'
import { ContactService } from './contact.service'
import { Contact, ContactSchema } from './entities/contact.entity'

@Module({
	imports: [
		AuthModule,
		UsersModule,
		MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
	],
	controllers: [ContactController],
	providers: [ContactService],
	exports: [ContactService],
})
export class ContactModule {}

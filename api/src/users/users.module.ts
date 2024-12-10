import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { SharedModule } from 'src/shared/shared.module'
import { User, UserSchema } from './schema/user.schema'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	imports: [
		SharedModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}

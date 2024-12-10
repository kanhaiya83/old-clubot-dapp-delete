import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { ContextController } from './context.controller'
import { ContextService } from './context.service'

@Module({
	imports: [SharedModule],
	controllers: [ContextController],
	providers: [ContextService],
})
export class ContextModule {}

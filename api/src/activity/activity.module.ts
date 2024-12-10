import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/users/users.module";
import { ActivityController } from "./activity.controller";
import { Activity, ActivitySchema } from "./activity.schema";
import { ActivityService } from "./activity.service";
import { HttpModule } from "@nestjs/axios";
import { TokenList, TokenListSchema } from "src/openai/schema/tokenList.schema";

@Module({
	imports: [
		UsersModule,
		MongooseModule.forFeature([
			{ name: Activity.name, schema: ActivitySchema },
			{ name: TokenList.name, schema: TokenListSchema },
		]),
	],
	controllers: [ActivityController],
	providers: [ActivityService],
})
export class ActivityModule {}

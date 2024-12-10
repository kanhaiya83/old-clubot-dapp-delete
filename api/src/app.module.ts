import { HttpLoggerMiddleware } from "@nest-toolbox/http-logger-middleware";

import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ActivityModule } from "./activity/activity.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssistantModule } from "./assistant/assistant.module";
import { AuthModule } from "./auth/auth.module";
import { ContactModule } from "./contact/contact.module";
import { ContextSeederModule } from "./context-seeder/context-seeder.module";
import { ContextModule } from "./context/context.module";
import { OpenAiModule } from "./openai/openai.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ScheduleModule.forRoot(),
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				uri: config.get<string>("MONGODB_URI"),
				dbName: "Dapp-Clubot",
			}),
		}),
		JwtModule.registerAsync({
			global: true,
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				secret: config.get<string>("JWT_SECRET"),
				signOptions: { expiresIn: "7d" },
			}),
		}),
		AuthModule,
		UsersModule,
		ContactModule,
		ContextModule,
		OpenAiModule,
		ActivityModule,
		ContextSeederModule,
		AssistantModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(HttpLoggerMiddleware).forRoutes({
			path: "*",
			method: RequestMethod.ALL,
		});
	}
}

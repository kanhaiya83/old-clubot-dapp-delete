import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DebankService } from "src/shared/debank.service";
import { CovalentService } from "./covalenthq.service";
import { TestController } from "./test.controller";

@Module({
	imports: [HttpModule],
	providers: [DebankService, CovalentService],
	exports: [DebankService, CovalentService],
	controllers: [TestController],
})
export class SharedModule {}

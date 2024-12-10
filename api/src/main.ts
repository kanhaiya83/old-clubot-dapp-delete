import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";

dotenv.config();
async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn"],
	});
	app.enableCors({ origin: "*" });
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	const config = new DocumentBuilder()
		.setTitle("Cluster APIs")
		.setDescription("Cluster for frontend")
		.setVersion("1.0")
		.addCookieAuth("accessToken")
		.build();
	const document = SwaggerModule.createDocument(app, config, {
		deepScanRoutes: true,
	});
	app.use(
		"/api",
		apiReference({
			showSidebar: true,
			darkMode: true,
			searchHotKey: "s",
			layout: "modern",
			theme: "kepler",
			spec: {
				content: document,
			},
		})
	);
	SwaggerModule.setup("api-legacy-docs", app, document, {
		customSiteTitle: "Cluster API",
	});
	console.log('Swagger api at http:/api');
	await app.listen(3005);
}
bootstrap();

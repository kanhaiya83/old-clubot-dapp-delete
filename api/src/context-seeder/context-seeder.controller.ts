import { Controller } from "@nestjs/common";
import { DefiLlamaService } from "./defiLlama.service";

@Controller("context-seeder")
export class ContextSeederController {
	constructor(private readonly defi: DefiLlamaService) {}
}

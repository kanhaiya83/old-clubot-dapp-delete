import { ApiProperty } from "@nestjs/swagger";

export class CreateSwapDto {
	@ApiProperty()
	tokenAName: string;

	@ApiProperty()
	tokenBName: string;

	@ApiProperty({ description: "Must start with 0x" })
	tokenAAddress: `0x${string}`;

	@ApiProperty({ description: "Must start with 0x" })
	tokenBAddress: `0x${string}`;

	@ApiProperty()
	amountA: number;

	@ApiProperty()
	amountB: number;

	@ApiProperty()
	txHash: `0x${string}`[];

	@ApiProperty()
	valueAinUSD: number;

	@ApiProperty()
	valueBinUSD: number;
}

export class CreateTransferDto {
	@ApiProperty()
	tokenName: string;

	@ApiProperty({ description: "Must start with 0x" })
	tokenAddress: `0x${string}`;

	@ApiProperty()
	to: `0x${string}`;

	@ApiProperty()
	amount: number;

	@ApiProperty()
	txHash: `0x${string}`[];

	@ApiProperty()
	valueInUSD: number;
}

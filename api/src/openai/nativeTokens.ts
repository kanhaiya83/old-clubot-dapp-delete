export const isNativeToken = (token: string) => {
	const nativeTokens = [
		"0x0000000000000000000000000000000000000000",
		"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
		"0x0000000000000000000000000000000000001010",
		"0x912CE59144191C1204E64559FE8253a0e49E6548",
		"0x4200000000000000000000000000000000000042",
	];
	return nativeTokens.includes(token.toLowerCase());
};

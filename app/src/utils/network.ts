import { CHAINS } from '../utils/tokens';

export const getNetworkByChain = (chain: any) => {
	switch (chain) {
		case 'ethereum':
			return CHAINS[0];
		case 'binance-smart-chain':
			return CHAINS[4];
		case 'avalanche':
			return CHAINS[6];
		case 'arbitrum-one':
			return CHAINS[1];
		case 'polygon-pos':
			return CHAINS[2];
		case 'optimistic-ethereum':
			return CHAINS[3];
		case 'base':
			return CHAINS[5];
		default:
			throw new Error('Unsupported chain');
	}
};

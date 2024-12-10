# `tokens.ts`

## Description
This file defines various token-related constants and configurations for the Cluster project, including supported chains, token lists, and utility functions for token operations across different blockchain networks.

## Imports
- `http` from 'viem'
- Chain configurations from 'wagmi/chains'

## Constants and Configurations

### `CHAINS`
An array of supported blockchain networks, including:
- Ethereum Mainnet
- Arbitrum
- Polygon
- Optimism
- Binance Smart Chain
- Base
- Avalanche

### `TOKENS_BY_CHAIN`
An object containing token lists for each supported chain, indexed by chain ID. Each token includes details such as:
- Name
- Address
- Symbol
- Decimals
- Logo URI
- Additional metadata (e.g., bridge information)

### `CHAIN_DETAILS`
An object mapping chain IDs to their respective chain configuration details.

### `transports`
An object defining HTTP transport configurations for each supported chain.

### `WRAPPED_TOKENS`
A mapping of chain IDs to the addresses of their respective wrapped native tokens (e.g., WETH for Ethereum).

## Functions

### `getWrappedToken(chainId: any)`
Returns the address of the wrapped native token for the given chain ID.

## Key Features
1. Multi-chain support: Includes configurations for multiple popular blockchain networks.
2. Comprehensive token lists: Provides detailed information about various tokens on each supported chain.
3. Wrapped token utilities: Offers easy access to wrapped native token addresses across chains.

## Usage Examples

```typescript
import { CHAINS, TOKENS_BY_CHAIN, getWrappedToken } from './tokens';

// Get all supported chains
console.log(CHAINS);

// Get tokens for Ethereum Mainnet
const mainnetTokens = TOKENS_BY_CHAIN[1];

// Get wrapped token address for Arbitrum
const wrappedArbitrumToken = getWrappedToken(42161);
```

## Notes
- This file serves as a central repository for token-related data and configurations in the Cluster project.
- It's crucial for cross-chain functionality and token management within the application.
- The token lists and chain configurations should be kept up-to-date to ensure accurate and current information.

This file plays a vital role in the Cluster project by providing essential data structures and utilities for handling tokens across multiple blockchain networks. It enables the application to support a wide range of tokens and chains, facilitating cross-chain operations and comprehensive token management features.

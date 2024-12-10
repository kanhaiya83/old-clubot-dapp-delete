# `useQuote.ts`

## Description
This file defines custom React hooks for fetching gas prices and swap quotes in the Cluster project. It provides functionality to interact with the backend API for obtaining real-time gas prices and swap quotes across different blockchain networks.

## Imports
- React hooks: `useEffect`, `useState`
- Utility functions: `fetchData`
- Configuration: `BASE_URL`

## Type Definitions

### `QuoteResponse`
Defines the structure of a swap quote response, including token details, amounts, gas estimates, and transaction data.

### `Token`
Describes the structure of a token, including its address, decimals, symbol, and name.

### `UseQuoteParams`
Parameters required for requesting a swap quote.

### `GasPrice`
Structure for gas price data, including standard, fast, and instant prices.

## Constants

### `chainMap`
A mapping of chain IDs to their respective identifiers used in API calls.

## Custom Hooks

### `useGasPrice(chainId: number)`

#### Purpose
Fetches and provides the current gas prices for a specified blockchain network.

#### Parameters
- `chainId`: The ID of the blockchain network

#### Returns
- `gasPrice`: An object containing standard, fast, and instant gas prices

#### Implementation Details
- Uses `useState` to manage gas price state
- Fetches gas price data from the backend API when the chain changes
- Updates the state with the fetched gas prices

### `useQuote(params: UseQuoteParams)`

#### Purpose
Fetches a swap quote based on the provided parameters.

#### Parameters
- `chainId`: The ID of the blockchain network
- `inTokenAddress`: Address of the input token
- `outTokenAddress`: Address of the output token
- `amount`: Amount to swap
- `slippage`: Allowed slippage percentage
- `gasPrice`: Current gas price
- `account`: User's account address

#### Returns
- `quote`: The fetched swap quote or `undefined` if not available

#### Implementation Details
- Uses `useState` to manage the quote state
- Fetches quote data from the backend API when any of the parameters change
- Updates the state with the fetched quote or sets it to `undefined` on error

## Usage Examples

```typescript
import { useGasPrice, useQuote } from './path/to/useQuote';

// Using the gas price hook
const { gasPrice } = useGasPrice(1); // For Ethereum mainnet

// Using the quote hook
const quoteParams = {
  chainId: 1,
  inTokenAddress: '0x...',
  outTokenAddress: '0x...',
  amount: 100,
  slippage: 0.5,
  gasPrice: gasPrice.fast,
  account: '0x...'
};
const { quote } = useQuote(quoteParams);
```

## Notes
- These hooks are crucial for providing real-time data for swap functionality in the Cluster application.
- They handle API interactions and state management, simplifying the usage in React components.
- Error handling is implemented in the `useQuote` hook to manage failed API requests.

These custom hooks play a vital role in the Cluster project by providing essential data for token swaps and gas price estimations. They encapsulate the logic for fetching this data from the backend, making it easy to integrate into various parts of the application that require up-to-date swap and gas information.

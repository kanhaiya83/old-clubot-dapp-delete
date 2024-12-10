# `useSwap.ts`

## Description
This file defines a custom React hook `useSwap` for handling token swap operations in the Cluster project. It manages the process of approving tokens and executing swaps, including fetching quotes and handling transactions for both native and non-native tokens.

## Imports
- React hooks from 'react'
- Custom hooks: `useApproveToken`, `useDataTransaction`
- Utility functions: `fetchData`, `wrappedTokenData`
- Constants: `BASE_URL`
- Wagmi hook: `useAccount`
- Types: `QuoteResponse`

## Hook: `useSwap`

### Parameters
- `tokenIn`: Address of the input token
- `tokenOut`: Address of the output token
- `amount`: Amount to swap
- `isNativeTokenIn`: Boolean indicating if the input token is native
- `isNativeTokenOut`: Boolean indicating if the output token is native
- `chain`: Chain identifier

### State Variables
- `hashes`: Array to store transaction hashes
- `isLoading`, `isTxLoading`, `isSuccess`: Boolean flags for tracking operation status
- `error`: Stores any error that occurs during the process
- `swapParam`: Object containing details of the swap operation
- `quote`: Stores the quote response from the API

### Main Logic
1. Fetches gas price and quote data when input parameters change
2. Manages approval and transaction processes based on whether native tokens are involved
3. Updates state based on the success or failure of approval and transaction steps
4. Provides an `executeSwap` function to initiate the swap process

### Key Functions

#### `startFetching`
Asynchronous function to fetch gas price and quote data.

#### `executeSwap`
Initiates the swap process, handling both native and non-native token scenarios.

### Effects
- Fetches quote data when input parameters change
- Manages the flow of approval and transaction based on their success states
- Updates swap parameters and status based on transaction outcomes

### Return Value
Returns an object containing:
- `isTxLoading`: Boolean indicating if a transaction is in progress
- `isSuccess`: Boolean indicating if the swap was successful
- `error`: Any error that occurred during the process
- `hash`: Array of transaction hashes
- `swapParam`: Object with detailed swap parameters
- `executeSwap`: Function to initiate the swap

## Usage Example
```typescript
const {
  isTxLoading,
  isSuccess,
  error,
  hash,
  swapParam,
  executeSwap
} = useSwap({
  tokenIn: '0x...',
  tokenOut: '0x...',
  amount: 100,
  isNativeTokenIn: false,
  isNativeTokenOut: false,
  chain: 'ethereum'
});

// To initiate a swap
await executeSwap();
```

## Error Handling
The hook manages errors through the `error` state variable, which is set when API calls or transactions fail.

## Related Documentation
- [OpenAI API Integration](https://docs.openai.com/api-reference/)
- [Wagmi Hooks Documentation](https://wagmi.sh/react/hooks/useAccount)

This hook is crucial for Cluster's token swapping functionality, handling the complexities of different token types and chain interactions in a DeFi context.

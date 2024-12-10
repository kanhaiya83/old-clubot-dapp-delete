# `useWrapToken.ts`

## Description
This file defines a custom React hook `useWrapToken` for handling token wrapping and unwrapping operations in the Cluster project. It manages the process of simulating and executing smart contract interactions for depositing (wrapping) or withdrawing (unwrapping) tokens.

## Imports

- React hooks: `useEffect`, `useState`, `useCallback`
- Wagmi hooks: `useSimulateContract`, `useWaitForTransactionReceipt`, `useWriteContract`
- Custom hook: `useNetwork`
- Contract ABI: `W_ERC20_ABI`

## Hook: `useWrapToken`

### Parameters
- `amount`: String representing the amount of tokens to wrap/unwrap
- `tokenAddress`: Ethereum address of the token contract
- `type`: "deposit" (wrap) or "withdraw" (unwrap)
- `wrappedName`: Optional name of the wrapped token

### State Variables
- `isSimulateLoading`: Boolean indicating if simulation is in progress
- `isSuccess`: Boolean indicating if the operation was successful
- `isLoading`: Boolean indicating if the transaction is being processed
- `hash`: Transaction hash or null
- `error`: Error object or null
- `swapParam`: Object containing details about the swap operation

### Main Logic

1. Uses `useSimulateContract` to simulate the contract interaction
2. Uses `useWriteContract` to execute the actual contract write operation
3. Uses `useWaitForTransactionReceipt` to wait for transaction confirmation
4. Manages state based on the status of simulation, writing, and transaction confirmation
5. Provides an `execute` function to trigger the contract interaction

### Return Value
An object containing:
- `isLoading`: Boolean
- `isSuccess`: Boolean
- `isSimulateSuccess`: Boolean
- `simulateError`: Error object or undefined
- `error`: Error object or null
- `hash`: Transaction hash or null
- `swapParam`: Object with swap details
- `execute`: Function to execute the wrap/unwrap operation

## Key Features

1. **Token Wrapping/Unwrapping**: Handles both depositing (wrapping) and withdrawing (unwrapping) of tokens.
2. **Transaction Simulation**: Simulates the transaction before execution to check for potential issues.
3. **Error Handling**: Manages errors from simulation, contract writing, and transaction confirmation.
4. **State Management**: Keeps track of various states throughout the process (loading, success, error).
5. **Network Awareness**: Uses the `useNetwork` hook to get information about the selected network.

## Usage Example

```typescript
const {
  isLoading,
  isSuccess,
  error,
  hash,
  execute
} = useWrapToken({
  amount: "1000000000000000000", // 1 ETH in wei
  tokenAddress: "0x...", // WETH contract address
  type: "deposit",
  wrappedName: "WETH"
});

// To execute the wrap operation
await execute();
```

## Error Handling
The hook manages errors from different stages (simulation, writing, transaction confirmation) and sets them in the `error` state variable.

## Related Documentation
- [Wagmi Documentation](https://wagmi.sh/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)

This hook is crucial for Cluster's token management features, particularly for wrapping and unwrapping native tokens (e.g., ETH to WETH and vice versa) which is often necessary for interacting with various DeFi protocols.

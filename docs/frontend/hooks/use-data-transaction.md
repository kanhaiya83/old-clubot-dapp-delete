# `useDataTransaction.ts`

## Description
This file defines a custom React hook `useDataTransaction` for handling cryptocurrency transactions in the Cluster project. It utilizes wagmi hooks for Ethereum interactions and manages the transaction lifecycle.

## Imports
- `react`: Core React hooks (useEffect, useState, useCallback)
- `wagmi`: Ethereum interaction hooks (useWaitForTransactionReceipt, usePrepareTransactionRequest, useSendTransaction, useAccount)

## Custom Hook

### `useDataTransaction({ to, data, gasPrice, gasLimit, value, isNativeTokenIn })`

A custom hook for managing cryptocurrency transactions.

Parameters:
- `to`: `0x${string}` - The recipient's Ethereum address
- `data`: `any` - Transaction data
- `gasPrice`: `any` - Gas price for the transaction
- `gasLimit`: `any` - Gas limit for the transaction
- `value`: `any` - Transaction value
- `isNativeTokenIn`: `boolean` (optional) - Flag indicating if the transaction involves native tokens

Returns:
- An object containing:
  - `isLoading`: `boolean` - Indicates if the transaction is in progress
  - `isSuccess`: `boolean` - Indicates if the transaction was successful
  - `error`: `Error | null` - Any error that occurred during the transaction
  - `hash`: ``0x${string}` | null` - The transaction hash
  - `execute`: `() => Promise<void>` - Function to execute the transaction

## Internal Logic

1. Uses `useAccount` to get the user's Ethereum address.
2. Utilizes `usePrepareTransactionRequest` to prepare the transaction request.
3. Employs `useSendTransaction` to send the transaction.
4. Uses `useWaitForTransactionReceipt` to wait for transaction confirmation.
5. Manages transaction states (loading, success, error) using `useState` and `useEffect`.
6. Provides an `execute` function to initiate the transaction process.

## Error Handling
- Catches and sets errors during the transaction preparation and execution process.
- Resets the transaction state on errors.

## Usage Example

```typescript
const { isLoading, isSuccess, error, hash, execute } = useDataTransaction({
  to: '0x...',
  data: '0x...',
  gasPrice: '...',
  gasLimit: '...',
  value: '...',
  isNativeTokenIn: true
});

// To execute the transaction
await execute();

// Check transaction status
if (isLoading) {
  console.log('Transaction in progress...');
} else if (isSuccess) {
  console.log('Transaction successful!', hash);
} else if (error) {
  console.error('Transaction failed:', error);
}
```

## Notes
- This hook is designed to work with Ethereum-compatible blockchains.
- It uses wagmi hooks, which should be set up correctly in the Cluster project.
- The hook handles both native token and contract interactions based on the `isNativeTokenIn` flag.

## Related Documentation
- [Wagmi Documentation](https://wagmi.sh/)
- [Ethereum Transactions](https://ethereum.org/en/developers/docs/transactions/)

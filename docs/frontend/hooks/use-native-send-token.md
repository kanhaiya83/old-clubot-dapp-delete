# `useSendNativeToken.ts`

## Description
This file defines a custom React hook `useSendNativeToken` for sending native tokens (e.g., ETH) on a blockchain network. It's part of the Cluster project and handles the transaction process, including sending, waiting for confirmation, and managing the transaction state.

## Imports
- `react`: Core React hooks for state management and side effects
- `wagmi`: Hooks for Ethereum interactions (transactions, account management)
- `useNetwork`: Custom hook for network selection

## Hook: `useSendNativeToken`

### Parameters
- `to`: `0x${string}` - The recipient's Ethereum address
- `amount`: `string` - The amount of native token to send

### Returns
An object containing:
- `isTxLoading`: `boolean` - Indicates if the transaction is being sent
- `isLoading`: `boolean` - Indicates if waiting for transaction confirmation
- `isSuccess`: `boolean` - Indicates if the transaction was successful
- `error`: `Error | null` - Any error that occurred during the process
- `sendParam`: `object` - Details of the sent transaction
- `sendNativeToken`: `function` - Function to initiate the token transfer

## State Management
- Uses various `useState` hooks to manage local state (loading, success, error, etc.)
- `sendParam` state stores details of the successful transaction

## Transaction Process
1. Utilizes `useSendTransaction` from wagmi to send the transaction
2. Uses `useWaitForTransactionReceipt` to wait for transaction confirmation
3. Updates state based on transaction status (pending, success, error)

## Effects
- Monitors transaction sending and confirmation status
- Updates loading and success states
- Resets the send transaction state after completion or error

## Error Handling
- Captures and sets errors from both sending and confirming transactions
- Resets the send transaction state on error

## Network Integration
- Uses the selected network's native currency details (name, decimals) from `useNetwork` hook

## Usage Example
```typescript
const { sendNativeToken, isLoading, isSuccess, error } = useSendNativeToken({
  to: '0x1234...', 
  amount: '1.5'
});

// To send the transaction
await sendNativeToken();

// Check status
if (isLoading) {
  console.log('Transaction is processing...');
} else if (isSuccess) {
  console.log('Transaction successful!');
} else if (error) {
  console.error('Transaction failed:', error);
}
```

## Notes
- This hook is specifically for sending native tokens (e.g., ETH on Ethereum)
- It handles the entire process from sending to confirmation
- Ensures proper error handling and state management throughout the transaction lifecycle

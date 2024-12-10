# `useSendToken.ts`

## Description
This file defines a custom React hook `useSendToken` for handling token transfer transactions in the Cluster project. It supports both ERC20 token transfers and native token transfers, utilizing Wagmi hooks for blockchain interactions.

## Imports
- React hooks: `useEffect`, `useState`, `useCallback`
- Wagmi hooks: `useReadContract`, `useSimulateContract`, `useWaitForTransactionReceipt`, `useWriteContract`
- Constants: `ERC20_ABI`
- Custom hook: `useSendNativeToken`

## Type Definitions

### `SendTokenResponse`
Defines the structure of the response object returned by the hook, including loading states, success flags, errors, and the send function.

## Custom Hook: `useSendToken`

### Parameters
- `to`: Recipient address
- `amount`: Amount of tokens to send
- `tokenAddress`: (Optional) Address of the ERC20 token contract

### State Variables
- Various state variables for managing loading, success, and error states
- `sendParam`: Object containing details of the send transaction

### Wagmi Hooks Usage
- `useReadContract`: Fetches token name and decimals
- `useSimulateContract`: Simulates the token transfer
- `useWriteContract`: Executes the actual transfer
- `useWaitForTransactionReceipt`: Waits for transaction confirmation

### Main Functionality
1. **Token Information**: Fetches token name and decimals if it's an ERC20 token
2. **Simulation**: Simulates the transfer for ERC20 tokens
3. **Execution**: Handles both ERC20 and native token transfers
4. **Transaction Monitoring**: Tracks the status of the transaction and updates state accordingly

### Effect Hooks
- Manage the overall state of the transfer process
- Update loading, success, and error states based on transaction status

### Callback: `sendToken`
- Triggers the actual token transfer
- Handles different logic for ERC20 and native token transfers

### Return Value
An object containing various states, errors, and the `sendToken` function

## Usage Example

```typescript
import { useSendToken } from './path/to/useSendToken';

function TokenTransferComponent() {
  const { isLoading, isSuccess, error, sendToken } = useSendToken({
    to: '0x...',
    amount: '1000000000000000000', // 1 token with 18 decimals
    tokenAddress: '0x...', // Optional: omit for native token transfer
  });

  return (
    <div>
      <button onClick={sendToken} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Token'}
      </button>
      {isSuccess && <p>Transfer successful!</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## Key Features
1. **Dual Functionality**: Handles both ERC20 and native token transfers
2. **Comprehensive State Management**: Tracks various states of the transfer process
3. **Error Handling**: Manages errors at different stages (simulation, execution, confirmation)
4. **Transaction Details**: Provides detailed information about the transaction in `sendParam`

## Notes
- The hook dynamically switches between ERC20 and native token transfer logic based on the presence of `tokenAddress`
- It integrates with `useSendNativeToken` for native token transfers
- The hook handles the entire transfer process, from simulation to confirmation, simplifying the implementation in React components

This `useSendToken` hook is a crucial component in the Cluster project, providing a unified interface for token transfers. It abstracts the complexities of different token types and blockchain interactions, making it easier for developers to implement token transfer functionality in their applications.

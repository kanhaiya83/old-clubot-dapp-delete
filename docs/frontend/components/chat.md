# `ChatButton.tsx`

## Description
This file defines a React component `ChatButton` that handles various cryptocurrency-related actions such as sending tokens, swapping tokens, and switching networks. It's a crucial part of the Cluster project's user interface for blockchain interactions.

## Imports
- React hooks from 'react'
- Wagmi hooks for blockchain interactions
- Custom hooks and utilities from the Cluster project

## Constants
- `BASE_URL`: API base URL from configuration

## Interfaces

### `ChatButtonProps`
Defines the props for the ChatButton component:
- `buttonText`: string
- `params`: any
- `isLast?: boolean`

## Component: ChatButton

### Props
- `buttonText`: Text to display on the button
- `params`: Parameters for the action (e.g., transaction details)
- `isLast`: Boolean to indicate if this is the last button in a sequence

### State and Hooks
- Uses various custom hooks for blockchain interactions (`useSendToken`, `useSwap`, `useNetwork`)
- Utilizes context from `MyStore` for chat-related state

### Key Functions

#### `sendMessage(message: string): Promise<void>`
Sends a message to the chat interface and updates chat history.

#### `confirmSwap(): Promise<void>`
Confirms a token swap transaction and updates the UI accordingly.

#### `confirmSend(): Promise<void>`
Confirms a token send transaction and updates the UI accordingly.

#### `switchNetwork(chainId: number): Promise<void>`
Switches the blockchain network and sends a confirmation message.

#### `confirmTransaction(): Promise<void>`
Initiates the appropriate transaction based on the `params.type` (switch-network, send-token, send-native, swap-tokens).

### Effects
- Handles error cases for send and swap transactions
- Confirms transactions when they are successful

### Render
Renders different button states based on the transaction status and `isLast` prop:
- Confirm and Cancel buttons for the last action
- "Processing..." button during transactions
- "Session Expired" for non-last buttons

## Usage Example
```jsx
<ChatButton 
  buttonText="Confirm Swap"
  params={{
    type: "swap-tokens",
    tokenIn: "0x...",
    tokenOut: "0x...",
    amount: "100",
    chain: 1
  }}
  isLast={true}
/>
```

## Error Handling
- Displays error messages in the chat interface for failed transactions
- Disables buttons during processing to prevent multiple submissions

## Related Documentation
- [Wagmi Documentation](https://wagmi.sh/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)

This component is central to Cluster's functionality, handling key blockchain interactions like token transfers and swaps. It integrates with the chat interface to provide a seamless user experience for cryptocurrency operations.

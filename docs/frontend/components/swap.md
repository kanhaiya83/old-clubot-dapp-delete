# `SwapPage.tsx`

## Description
This file contains the `SwapPage` component, which is a crucial part of the Cluster project's token swapping functionality. It allows users to swap between different tokens across various blockchain networks.

## Imports
- React hooks and components
- Custom SVG components and UI elements
- React Router components
- Custom context (MyStore) and hooks
- Wagmi hooks for blockchain interactions
- Contract ABIs and utility functions
- Configuration constants

## Constants and State
- Various state variables for managing the swap process, including:
  - `sendAmount`: Amount of tokens to send
  - `sendHistory`: Array of recent swap transactions
  - `isSwapping`: Boolean to track if a swap is in progress
  - `hashesList`: List of transaction hashes
  - `swapParam`: Object containing details of the current swap

## Custom Hooks and Contexts
- `useAccount`, `useBalance`, `useReadContract`, `useSendTransaction`, `useWriteContract`, `useWaitForTransactionReceipt` from Wagmi
- `useGasPrice`, `useQuote` custom hooks for fetching gas prices and swap quotes
- `MyStore` context for global state management

## Main Component: SwapPage

### Key Functionalities
1. Token Selection: Allows users to select tokens for swapping
2. Amount Input: Users can input the amount of tokens to swap
3. Swap Execution: Handles the swap process, including approvals and transactions
4. Transaction History: Displays recent swap transactions
5. Native Token Handling: Special handling for native tokens (e.g., ETH) and wrapped versions

### Effects
- Fetches and updates swap history
- Manages the swap process and transaction states
- Handles quote updates and transaction execution
- Updates UI based on transaction status

### Swap Process
1. Validates input (token selection, balance, amount)
2. Initiates the swap process
3. Handles approvals for ERC20 tokens
4. Executes the swap transaction
5. Updates the UI and history after successful swap

### UI Components
- Token selection and amount input fields
- Swap button
- Recent swaps table
- Responsive design for mobile and desktop

## Subcomponent: Details

### Purpose
Renders the details for each side of the swap (send and receive)

### Props
- `heading`: Section heading
- `showMax`: Boolean to show max button
- `isSender`: Boolean to determine if it's the sender side
- `amount`: Token amount
- `isNativeToken`: Boolean for native token check
- `selectedToken`: Selected token object
- `outAmount`: Output amount for receive side
- `onInputChange`: Function to handle input changes
- `isNativePair`: Boolean for native token pair check

### Functionality
- Displays token amount and balance
- Handles max button functionality
- Shows token symbol and balance

## Key Features
- Cross-chain token swapping
- Native token and wrapped token handling
- Real-time quote fetching
- Transaction history tracking
- Responsive design for various screen sizes

## Error Handling
- Toast notifications for various error scenarios
- Transaction state management to handle failures

## Usage Example
```jsx
import SwapPage from './components/SwapPage';

function App() {
  return (
    <div>
      <SwapPage />
    </div>
  );
}
```

## Related Documentation
- [Wagmi Documentation](https://wagmi.sh/)
- [React Router Documentation](https://reactrouter.com/)

This `SwapPage` component is a central feature of the Cluster project, enabling users to perform token swaps across different blockchain networks with a user-friendly interface and robust error handling.

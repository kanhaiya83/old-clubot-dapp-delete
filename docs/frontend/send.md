# `SendPage.tsx`

## Description
This file defines the SendPage component, which provides functionality for users to send tokens and view their recent send transactions in the Cluster application.

## Imports
- React hooks and components
- Custom components (CustomInput, SelectTokens, etc.)
- Wagmi hooks for blockchain interactions
- Utility functions and constants

## Main Component: `SendPage`

### State Variables
- `sendHistory`: Array of recent send transactions
- `sendAmount`: Amount of tokens to send
- `sendAddress`: Recipient's address
- `isSendToken`: Boolean to track if a send transaction is in progress

### Hooks
- Uses various Wagmi hooks for blockchain interactions (useAccount, useBalance, useReadContract, etc.)
- Uses React Router's useLocation for navigation

### Key Functions
1. `isNativeToken()`: Checks if the selected token is the chain's native token
2. `sendTokenCall()`: Handles the token sending process, including validation and transaction execution

### Effects
- Fetches send history on component mount
- Handles transaction confirmation and updates send history
- Manages error handling and success notifications

### Render Method
The component renders:
1. A tab navigation for Send/Receive/Swap
2. Token selection, amount input, and recipient address input fields
3. A "Send Tokens" button
4. A table (desktop) or list (mobile) of recent send transactions

## Key Features
1. **Token Selection**: Users can select which token to send
2. **Amount Input**: With a "Max" button to easily input the maximum available balance
3. **Address Input**: For entering the recipient's address
4. **Transaction Execution**: Handles both native and ERC20 token transfers
5. **Transaction History**: Displays recent send transactions with details
6. **Responsive Design**: Different layouts for desktop and mobile views

## Error Handling
- Validates input fields before sending transactions
- Displays toast notifications for errors and successful transactions

## Notes
- Uses context (MyStore) for global state management
- Integrates with blockchain through Wagmi hooks
- Implements responsive design for different screen sizes
- Handles both native token and ERC20 token transfers

## Usage Example
This component is typically used as a route in the main application:

```jsx
<Route path="/send" element={<SendPage />} />
```

The SendPage component provides a comprehensive interface for users to send tokens and view their transaction history, integrating closely with the blockchain functionality of the Cluster application.

# `LoginPage.tsx`

## Description
This file contains the `LoginPage` component for the Cluster project. It provides a user interface for wallet connection and user authentication, including support for referral codes.

## Imports
- React hooks and components
- Custom context (MyStore) and UI components
- Wallet connection hooks from `wagmi` and `@web3modal/wagmi/react`
- SVG components and UI dialogs

## Component: LoginPage

### State and Hooks
- `useWeb3Modal()`: For opening the Web3Modal
- `useAccount()`: For accessing wallet account information
- `useState()`: Local state for OTC (One Time Code) input
- `useContext(MyStore)`: Global state and actions for referral code, OTC, and other settings

### Effects
1. Checks for referral code in URL parameters and sets it in the global state

### Main Functionality
1. Wallet Connection: Allows users to connect their cryptocurrency wallet
2. Referral Code: Provides input for referral code
3. OTC Verification: Implements a dialog for OTC input when required

### Render
Returns a login page with:
- Branding elements (logo, mascot image)
- Introductory text about CLUBOT (the Cluster Protocol Sidekick)
- Wallet connection button
- Referral code input
- Responsive design for desktop and mobile views
- OTC verification dialog

## Key Features
- Integrates with Web3Modal for wallet connection
- Supports referral code system
- Implements OTC verification process
- Responsive design adapting to different screen sizes

## UI Components
- Custom styled inputs and buttons
- Dialog for OTC verification
- SVG icons for enhanced visual appeal

## Usage Example
```jsx
import LoginPage from './components/LoginPage';

function App() {
  return (
    <div>
      <LoginPage />
    </div>
  );
}
```

## Related Documentation
- [Web3Modal Documentation](https://docs.walletconnect.com/2.0/web3modal/about)
- [Wagmi Hooks Documentation](https://wagmi.sh/react/hooks/useAccount)

This LoginPage component is a crucial part of the Cluster project's user onboarding process. It provides a user-friendly interface for connecting wallets and entering the application, while also supporting features like referral codes and OTC verification, which are important for user acquisition and security in cryptocurrency applications.

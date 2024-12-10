# `Activity.tsx`

## Description
This file contains the `Activity` component, which displays a user's transaction history in the Cluster project. It shows both transfer and swap activities in a tabular format for desktop and a card format for mobile views.

## Imports
- React hooks from 'react'
- UI components from local files
- Utility functions and configurations
- `useAccount` hook from 'wagmi' for blockchain account information

## Constants
- `BASE_URL`: API base URL (imported from config)

## Component: Activity

### State
- `sendHistory`: Array of transaction history items

### Effects
- Fetches activity data on component mount

### Render
Returns a section with:
1. Desktop view: Table of activities
2. Mobile view: List of `TokenDetailsContainer` components

## Functions

### `fetchData(url: string, method: string): Promise<any>`
Fetches activity data from the API.

### `copyToClipboard(text: string): void`
Copies the given text to clipboard.

## Usage Example
```jsx
import Activity from './Activity';

function App() {
  return (
    <div>
      <Activity />
    </div>
  );
}
```

## Key Features
1. Displays transfer and swap activities
2. Responsive design (table for desktop, cards for mobile)
3. Links to blockchain explorer for token addresses
4. Copy-to-clipboard functionality for transaction hashes

## Error Handling
- Logs errors to console if data fetching fails

## Related Documentation
- [Wagmi Documentation](https://wagmi.sh/)
- [React Router Documentation](https://reactrouter.com/)

## Notes
- The component uses custom UI components like `Table`, `Badge`, etc.
- It integrates with blockchain data using the `useAccount` hook from wagmi
- The component handles both transfer and swap type transactions
- Transaction hashes are displayed with a copy-to-clipboard feature
- Token addresses are linked to the blockchain explorer

This component is crucial for providing users with a clear overview of their recent cryptocurrency activities, enhancing the transparency and usability of the Cluster application.

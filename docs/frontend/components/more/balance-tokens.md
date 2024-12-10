# `AddTokenPage.tsx`

## Description
This file contains the `AddTokenPage` component for the Cluster project. It displays a list of balance tokens for the user, showing their amounts and values.

## Imports
- React hooks from `react`
- `MyStore` context from `../../helper/MyStore`
- UI components: `Button` from `../ui/button`
- `Link` from `react-router-dom` for navigation

## Component: AddTokenPage

### State and Hooks
- `useContext(MyStore)`: Accesses the global state, specifically `balances`
- `useState()`: Local state for `tokenBalance`

### Effects
- `useEffect()`: Filters and sets the token balance list when `balances` change

### Main Functionality
1. Token Filtering: Filters tokens with positive amounts and prices
2. Token List Display: Shows a list of tokens with their logos, names, symbols, amounts, and values

### Render
Returns a section containing:
- Back button to navigate to "/more"
- "Balance Tokens" header
- A scrollable list of tokens with their details

## Key Features
- Displays token balances with their current value in USD
- Filters out tokens with zero balance or no price information
- Provides a clean, styled interface for viewing token balances

## UI Components
- Custom styled button for navigation
- Gradient-styled token count display
- Scrollable list with hover effects on items

## Styling
- Uses custom CSS classes for layout and styling
- Implements a responsive design with scrollable content

## Usage Example
```jsx
import AddTokenPage from './components/AddTokenPage';

function App() {
  return (
    <div>
      <AddTokenPage />
    </div>
  );
}
```

## Related Documentation
- [React Context API](https://reactjs.org/docs/context.html)
- [React Router Documentation](https://reactrouter.com/en/main)

This `AddTokenPage` component is an essential part of the Cluster project, providing users with a clear overview of their token balances. It's particularly useful for cryptocurrency management, allowing users to quickly see their holdings and their current values.

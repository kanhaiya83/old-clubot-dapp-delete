# `Bot.tsx`

## Description
This file defines the `Bot` component, which serves as the main layout for the chat interface in the Cluster project. It includes a sidebar for chat listings and the main chat inbox area.

## Imports
- `useContext`, `useEffect`: React hooks for managing context and side effects
- `GradientLine`: A custom component for visual separation
- `fetchData`: A helper function for making API requests
- `ChatInbox`: Component for displaying the main chat interface
- `ChatListingSidebar`: Component for displaying the list of chats
- `MyStore`: Context for managing global state
- `BASE_URL`: Configuration constant for API endpoint

## Constants
No constants defined in this file.

## Component

### `Bot: React.FC`
The main component for the chat interface layout.

#### Effects
- Fetches the list of chats when a user is logged in and updates the global state.

#### Rendered Elements
1. `ChatListingSidebar`: Displays the list of chats
2. `GradientLine`: Visual separator (hidden on small screens)
3. `ChatInbox`: Main chat interface

## Usage Example
```tsx
import Bot from './Bot';

function App() {
  return (
    <div className="app">
      <Bot />
    </div>
  );
}
```

## Related Documentation
- [React Context API](https://reactjs.org/docs/context.html)
- [React useEffect Hook](https://reactjs.org/docs/hooks-effect.html)

## Notes
- This component relies on the `MyStore` context for global state management, specifically for `loggedUser` and `setChatList`.
- The chat list is fetched from the server when a user is logged in, using the `BASE_URL` configuration.
- The layout is responsive, with the `GradientLine` being hidden on smaller screens (below `lg` breakpoint).

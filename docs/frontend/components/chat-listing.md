# `ChatListingSidebar.tsx`

## Description
This file contains the `ChatListingSidebar` component, which displays a list of chat conversations and provides functionality to manage them in the Cluster project.

## Imports
- React hooks and components from 'react'
- Context and helper functions from project-specific files
- SVG components and icons
- UI components from a custom UI library
- Toast notifications from 'sonner'
- Configuration constants

## Constants
- `BASE_URL`: API base URL (imported from config)

## Component: ChatListingSidebar

### Description
A functional component that renders a sidebar with a list of chat conversations, allowing users to select, create, and delete chats.

### Key Features
1. Responsive design (hides on smaller screens when chat is active)
2. New chat creation button
3. List of existing chats with selection functionality
4. Chat deletion with confirmation dialog

### Context Usage
Uses the following from `MyStore` context:
- `chatList`: Array of chat conversations
- `selectedChat`: Currently selected chat ID
- `setChatList`: Function to update chat list
- `setSelectedChat`: Function to set the selected chat
- `chatInboxActive`: Boolean to control chat inbox visibility
- `setChatInboxActive`: Function to toggle chat inbox active state

### Main Logic
1. Checks screen width and chat active state to determine visibility
2. Renders a "New Chat" button
3. Maps through `chatList` to display each chat
4. Provides functionality to select a chat
5. Implements chat deletion with confirmation

### Functions

#### `deleteChat(id: string): void`
Deletes a chat conversation.

Parameters:
- `id`: The ID of the chat to be deleted

Functionality:
- Sends a DELETE request to the server
- Updates the local chat list
- Clears the selected chat
- Displays a success or error toast notification

### Error Handling
- Uses toast notifications to display error messages when chat deletion fails

### UI Components
- Uses custom Alert Dialog components for delete confirmation
- Implements responsive design for mobile and desktop views

## Usage Example
```jsx
import ChatListingSidebar from './path/to/ChatListingSidebar';

function App() {
  return (
    <div>
      <ChatListingSidebar />
      {/* Other components */}
    </div>
  );
}
```

## Related Documentation
- [React Context API](https://reactjs.org/docs/context.html)
- [Sonner Toast Notifications](https://sonner.emilkowal.ski/)

This component is crucial for the chat management feature in Cluster, allowing users to navigate between different conversations and manage their chat history efficiently.

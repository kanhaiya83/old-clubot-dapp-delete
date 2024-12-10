# `ChatInbox.tsx`

## Description
This file contains the `ChatInbox` component, which is the main chat interface for the Cluster AI bot. It handles message display, user input, and interaction with the AI assistant.

## Imports
- React hooks and components from 'react'
- SVG components and icons
- Custom components and helpers
- Configuration constants
- Web3 hooks from 'wagmi'

## Constants
- `maxCharCount`: Maximum character limit for user messages (4000)

## Component: ChatInbox

### State and Context
- Uses `MyStore` context for global state management
- Local state for message input and refs

### Effects
1. Fetches chat history when a chat is selected
2. Scrolls to the bottom of the chat when history updates
3. Handles responsive layout for mobile devices

### Main Functions

#### `handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>)`
Manages the message input, enforcing the character limit.

#### `sendMessage(message: string)`
Sends a user message to the AI assistant and updates the chat history.

Parameters:
- `message`: The user's input message

#### `handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>)`
Handles the Enter key press for sending messages or adding new lines.

#### `quickPromptHandler({ prompt }: { prompt: string })`
Handles quick prompt selection and sends the selected prompt.

### Render Logic
- Displays chat history or welcome message
- Renders message input area
- Shows quick chat prompts when no chat history is present
- Implements responsive design for mobile and desktop views

## Usage Example
```jsx
<ChatInbox />
```

## Error Handling
- Checks for empty messages before sending
- Disables input during loading states

## Related Documentation
- [Web3 Integration with wagmi](https://wagmi.sh/)

## Notes
- This component is central to the Cluster bot's chat functionality
- It supports multiple blockchain networks (Ethereum, Polygon, BSC, etc.)
- Implements real-time chat updates and history management

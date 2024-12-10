    # `Message.tsx`

## Description
This file defines a React component for rendering chat messages in the Cluster project. It handles both user and bot messages, including support for markdown formatting, tables, QR codes, and web3 interactions.

## Imports
- `clsx`: Utility for constructing className strings conditionally
- `ChatTable`: Component for rendering table data in chat messages
- `domPurify`: Library for sanitizing HTML content
- `ChatButton`: Component for rendering web3 interaction buttons
- `Spinner`: Component for displaying loading state
- `markdownToHtml`: Utility function for converting markdown to HTML
- `ReceiveTokens`: Component for displaying QR code for receiving tokens
- `useAccount`: Hook from wagmi for accessing account information
- React hooks and types

## Interfaces

### `MessageProps`
Defines the props for the Message component:
- `from`: "sender" | "receiver"
- `message`: string
- `tableData`: any[]
- `web3Data`: any
- `isLast`: boolean
- `isLoading`: boolean

## Component: Message

### `Message: FC<MessageProps>`
The main functional component for rendering chat messages.

Key features:
1. Sanitizes and formats the message content
2. Renders different styles for sender and receiver messages
3. Handles loading state with a spinner
4. Supports rendering of tables, QR codes, and web3 interaction buttons
5. Displays user/bot avatar

## Key Functions

### `useMemo(() => domPurify.sanitize(...))`
Sanitizes the message content to prevent XSS attacks.

### `useMemo(() => markdownToHtml(...))`
Converts the sanitized message from markdown to HTML.

## Styling
Uses `clsx` for conditional className construction, applying different styles based on the message sender and loading state.

## Rendering Logic
1. Renders a loading spinner if `isLoading` is true
2. Renders the formatted message content
3. Conditionally renders `ChatTable`, `ReceiveTokens`, or `ChatButton` based on `tableData` and `web3Data`
4. Displays user/bot avatar

## Usage Example
```jsx
<Message
  from="sender"
  message="Hello, world!"
  tableData={[]}
  web3Data={null}
  isLast={true}
  isLoading={false}
/>
```

## Related Documentation
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [wagmi Documentation](https://wagmi.sh/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

This component is crucial for the chat interface in Cluster, handling various types of messages and interactions related to cryptocurrency and blockchain functionalities.

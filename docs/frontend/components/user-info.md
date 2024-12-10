# `ProfilePage.tsx`

## Description
This file contains the `ProfilePage` component for the Cluster project. It displays user profile information, settings, and connected platforms.

## Imports
- Various SVG components from `../atoms/svg-comps/`
- Utility function `copyToClipboard` from `../lib/utils`

## Component: ProfilePage

### Main Structure
The component is structured into several sections:
1. User Profile Information
2. Networks
3. Settings
4. Connected Platforms

### User Profile Section
- Displays user's profile picture, name, email, refer ID, and security PIN
- Includes a logout button
- Shows connected wallet addresses for Ethereum and Bitcoin

### Networks Section
- Displays primary network (Ethereum)
- Shows available balance
- Includes a "Manage Networks" button

### Settings Section
- Language selection
- Currency selection
- Sound settings
- Theme toggle (light/dark mode)

### Connected Platforms Section
- Lists connected platforms (Telegram, Viber, Discord)
- Includes a "Connect More" button

### Styling
- Uses Tailwind CSS for styling
- Implements custom gradients and colors for a unique design

## Subcomponent: Icon
A small utility component for rendering icons with a consistent style.

### Props
- `children`: React.ReactNode - The icon to be rendered

## Key Features
- Responsive design using grid layout
- Integration with cryptocurrency wallets (Ethereum and Bitcoin addresses)
- Customizable user settings
- Platform connections for enhanced user experience

## Usage Example
```jsx
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <div>
      <ProfilePage />
    </div>
  );
}
```

## Notes
- The component uses dummy data and images. In a real application, these would be replaced with dynamic user data.
- The wallet addresses are truncated for display purposes.
- The component includes functionality to copy wallet addresses to clipboard.

## Related Documentation
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation on Components and Props](https://reactjs.org/docs/components-and-props.html)

This ProfilePage component is an essential part of the Cluster project, providing users with a comprehensive view of their profile, settings, and connected accounts. It showcases integration with cryptocurrency wallets and offers customization options, aligning with Cluster's focus on cryptocurrency and blockchain features.

# `ContactPage.tsx`

## Description
This file contains the `ContactPage` component for the Cluster project. It manages the display, addition, editing, and deletion of user contacts.

## Imports
- React hooks from `react`
- UI components from custom UI library and `@radix-ui/react-dialog`
- Form handling with `react-hook-form` and `zod` for validation
- SVG components for icons
- Utility functions and configurations

## Constants
- `BASE_URL`: API base URL from configuration

## Component: ContactPage

### State
- `mode`: Current mode of operation ('add', 'edit', or 'delete')
- `editContactDetails`: Details of the contact being edited
- `deleteContactDetails`: Details of the contact being deleted
- `contacts`: Array of user contacts
- `addContactPending`: Loading state for add/edit operations
- `showDialog`: Controls the visibility of the add/edit dialog

### Effects
- Fetches contacts data on component mount

### Form Schema
Defines validation rules for contact form fields using Zod

### Main Functionality
1. Contact List Display: Shows a list of user contacts
2. Add Contact: Allows users to add new contacts
3. Edit Contact: Enables editing of existing contacts
4. Delete Contact: Provides functionality to remove contacts
5. Copy Address: Allows copying of contact addresses to clipboard

### Key Features
- Form validation using Zod and react-hook-form
- Responsive dialog for adding and editing contacts
- Confirmation dialog for contact deletion
- Integration with backend API for CRUD operations

### Render
Returns a section containing:
- Header with "Add Contact" button
- List of contacts with options to edit and delete
- Dialog for adding/editing contacts
- Alert dialog for confirming contact deletion

## Error Handling
- Displays toast notifications for successful operations and errors

## Usage Example
```jsx
import ContactPage from './components/ContactPage';

function App() {
  return (
    <div>
      <ContactPage />
    </div>
  );
}
```

## Related Documentation
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://github.com/colinhacks/zod)
- [Radix UI Dialog Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)

This ContactPage component is crucial for the Cluster project as it provides a user interface for managing contacts, which is essential for facilitating cryptocurrency transactions and interactions within the application. It demonstrates integration with a backend API, form handling, and state management for a complex user interface

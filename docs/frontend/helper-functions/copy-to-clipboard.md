# `utils.ts`

## Description
This file contains utility functions used across the Cluster application. It includes functions for class name merging and clipboard operations.

## Functions

### `cn(...inputs: ClassValue[])`

#### Purpose
Merges CSS class names using `clsx` and `tailwind-merge` for efficient class name handling, especially useful with Tailwind CSS.

#### Parameters
- `...inputs: ClassValue[]`: An array of class values (strings, objects, or arrays)

#### Returns
- A string of merged class names

#### Implementation Details
- Uses `clsx` to combine class names
- Applies `twMerge` to resolve Tailwind CSS conflicts

#### Usage Example
```typescript
import { cn } from './path/to/utils';

const className = cn(
  'text-red-500',
  { 'bg-blue-200': isActive },
  ['p-4', 'rounded']
);
```

### `copyToClipboard(text: number | string)`

#### Purpose
Copies the provided text or number to the system clipboard.

#### Parameters
- `text: number | string`: The value to be copied to the clipboard

#### Implementation Details
1. Creates a temporary `<input>` element
2. Sets its value to the provided text
3. Appends it to the document body
4. Selects the text in the input
5. Executes the copy command
6. Removes the temporary input element

#### Usage Example
```typescript
import { copyToClipboard } from './path/to/utils';

const handleCopy = () => {
  copyToClipboard('Text to be copied');
  // Optionally, show a notification that text was copied
};
```

## Imports
- `clsx`: A utility for constructing className strings conditionally
- `tailwind-merge`: A utility to merge Tailwind CSS classes without style conflicts

## Notes
- The `cn` function is particularly useful in React components where you need to conditionally apply classes, especially when using Tailwind CSS.
- The `copyToClipboard` function provides a cross-browser compatible way to copy text to the clipboard without relying on newer APIs that might not be supported in all browsers.

## Error Handling
- These utility functions do not include explicit error handling. It's advisable to wrap the usage of `copyToClipboard` in a try-catch block in case of any unexpected issues with DOM manipulation.

These utility functions enhance the development experience in the Cluster application by providing easy-to-use solutions for common tasks like class name management and clipboard operations.

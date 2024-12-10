# `fetchData.ts`

## Description
This file defines a utility function `fetchData` for making HTTP requests in the Cluster application. It's designed to handle authentication, request methods, and error scenarios.

## Function: `fetchData`

### Parameters
- `url: string`: The endpoint URL to which the request is made
- `method: string`: HTTP method (default is "GET")
- `body: any`: Request body (optional, default is null)

### Functionality

1. **Authentication**
   - Retrieves the authentication token from local storage
   - Adds the token to the request headers

2. **Request Configuration**
   - Sets up the fetch request with the provided method, headers, and body
   - Automatically stringifies the body if present

3. **Response Handling**
   - Returns the JSON response if the request is successful (status OK)
   - Handles 403 (Forbidden) status by clearing local and session storage
   - Throws an error for other non-successful responses

4. **Error Handling**
   - Catches and logs any errors during the fetch process
   - Re-throws errors with the error message

### Key Features
1. **Flexible**: Supports different HTTP methods and request bodies
2. **Authentication**: Automatically includes the authentication token
3. **Error Management**: Handles different error scenarios, including authentication failures
4. **JSON Parsing**: Automatically parses JSON responses

## Usage Example

```typescript
import { fetchData } from './path/to/fetchData';

// GET request
try {
  const data = await fetchData('https://api.example.com/users');
  console.log(data);
} catch (error) {
  console.error('Failed to fetch users:', error);
}

// POST request with body
try {
  const newUser = { name: 'John Doe', email: 'john@example.com' };
  const response = await fetchData('https://api.example.com/users', 'POST', newUser);
  console.log('New user created:', response);
} catch (error) {
  console.error('Failed to create user:', error);
}
```

## Notes
- This function is crucial for maintaining consistent API communication throughout the Cluster application
- It handles authentication automatically, reducing the need for repetitive code
- The function clears local and session storage on receiving a 403 status, which can be used to handle session expiration
- Error logging is implemented, which can be useful for debugging and monitoring

## Error Handling
- Logs errors to the console
- Throws errors with descriptive messages, allowing calling code to implement specific error handling

This `fetchData` function provides a robust and reusable way to make API requests in the Cluster application, handling common scenarios like authentication and error management centrally.

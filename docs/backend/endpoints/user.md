# Cluster NestJS Backend - Users Module Documentation

## Overview

This documentation covers the Users module of the Cluster NestJS backend, which handles user-related operations, including user management, token listing, and referral tracking.

**Last Modified:** [Current Date]

## File Structure

1. `users.module.ts`: Module definition
2. `users.controller.ts`: Controller for handling HTTP requests
3. `users.service.ts`: Service for business logic and data operations

## Imports and Dependencies

- `@nestjs/common`: Core NestJS functionalities
- `@nestjs/mongoose`: MongoDB integration for NestJS
- `src/auth/auth.module`: Authentication module (imported but not used directly in this file)
- `src/shared/shared.module`: Shared module containing common services
- `mongoose`: MongoDB object modeling tool

## Module Definition (`users.module.ts`)

```typescript
@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

This module:
- Imports `SharedModule` for common functionalities
- Sets up MongoDB integration for the User model
- Declares `UsersController` and `UsersService`
- Exports `UsersService` for use in other modules

## Controller (`users.controller.ts`)

### Decorators
- `@Controller('user')`: Defines the base route for this controller
- `@Authenticated()`: Custom decorator for authentication (implementation not shown)
- `@Get()`: HTTP GET method decorator

### Methods

#### `getHello()`
- Route: `GET /user`
- Returns: `string`
- Description: Simple hello world endpoint (likely for testing)

#### `getTokenList()`
- Route: `GET /user/token-list/:chain_id`
- Authentication: Required
- Parameters:
  - `@UserInfo() user: ReqUser`: Authenticated user information
  - `@Param('chain_id') chainId: string`: Blockchain network identifier
- Returns: `Promise<any>` (Token list for the specified chain)
- Description: Retrieves the token list for a user on a specific blockchain

#### `me()`
- Route: `GET /user/me`
- Authentication: Required
- Parameters:
  - `@UserInfo() user: ReqUser`: Authenticated user information
- Returns: `Promise<UserDocument>` (User details)
- Description: Retrieves the authenticated user's details

#### `getReferralList()`
- Route: `GET /user/referrals`
- Authentication: Required
- Parameters:
  - `@UserInfo() user: ReqUser`: Authenticated user information
- Returns: `Promise<UserDocument[]>` (List of referrals)
- Description: Retrieves the list of users referred by the authenticated user

## Service (`users.service.ts`)

### Dependencies
- `@InjectModel(User.name) private userModel: Model<UserDocument>`: MongoDB model for User
- `private readonly debankService: DebankService`: Service for interacting with DeBank API

### Methods

#### `getTokenList(user: ReqUser, chainId: string)`
- Description: Retrieves token list for a user on a specific blockchain
- Parameters:
  - `user: ReqUser`: User information
  - `chainId: string`: Blockchain network identifier
- Returns: `Promise<any>` (Token list from DeBank API)
- Implementation:
  - Maps chain IDs to DeBank-specific coin IDs
  - Calls DeBank service to fetch token list

#### `findByAddress(address: string)`
- Description: Finds a user by their blockchain address
- Parameters:
  - `address: string`: User's blockchain address
- Returns: `Promise<UserDocument>`

#### `findByReferralCode(code: string)`
- Description: Finds a user by their referral code
- Parameters:
  - `code: string`: Referral code
- Returns: `Promise<UserDocument>`

#### `findById(id: string)`
- Description: Finds a user by their MongoDB ID
- Parameters:
  - `id: string`: User's MongoDB ID
- Returns: `Promise<UserDocument>`

#### `create(createUserDto: User)`
- Description: Creates a new user
- Parameters:
  - `createUserDto: User`: User data transfer object
- Returns: `Promise<UserDocument>`

#### `getReferralList(user: ReqUser)`
- Description: Retrieves the list of users referred by a given user
- Parameters:
  - `user: ReqUser`: User information
- Returns: `Promise<UserDocument[]>`

## Schemas and DTOs

### User Schema (referenced but not defined in the provided code)
- Likely includes fields such as:
  - `address`: User's blockchain address
  - `referral`: User's referral code
  - `referrer`: Reference to the user who referred this user

### ReqUser Interface (referenced but not defined in the provided code)
- Likely includes:
  - `id`: User's MongoDB ID
  - `address`: User's blockchain address

## Cryptocurrency-Specific Features

1. **Blockchain Integration**: 
   - Supports multiple blockchain networks (Ethereum, Binance Smart Chain, Avalanche, etc.)
   - Maps chain IDs to specific coin IDs for API interactions

2. **Token Listing**:
   - Fetches token lists for users across different blockchain networks
   - Utilizes the DeBank API for comprehensive token information

3. **User Identification**:
   - Users are identified by their blockchain addresses
   - Supports referral system, likely for cryptocurrency-related rewards or tracking

## Error Handling

- Not explicitly shown in the provided code
- Recommended to implement try-catch blocks and custom exception filters

## Security Measures

1. **Authentication**:
   - `@Authenticated()` decorator used to protect routes
   - User information injected via `@UserInfo()` decorator

2. **Data Access Control**:
   - Users can only access their own data or referrals

## Example Usage

### Fetching User's Token List

```typescript
// In a client application or API test
const response = await fetch('https://api.cluster.com/user/token-list/ethereum', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <user_jwt_token>'
  }
});
const tokenList = await response.json();
console.log(tokenList);
```

### Retrieving User's Referrals

```typescript
// In a client application or API test
const response = await fetch('https://api.cluster.com/user/referrals', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <user_jwt_token>'
  }
});
const referrals = await response.json();
console.log(referrals);
```

## Related Documentation

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [DeBank API Documentation](https://docs.cloud.debank.com/en/readme/api-pro-reference)

## Notes for Improvement

1. Implement comprehensive error handling and logging
2. Add input validation for user inputs (e.g., chain IDs)
3. Consider implementing rate limiting for API calls
4. Enhance documentation with more detailed API response structures
5. Implement unit and integration tests for the module

This documentation provides a comprehensive overview of the Users module in the Cluster NestJS backend, focusing on its cryptocurrency-related features, API endpoints, and data management. It serves as a guide for developers working on or integrating with this module.

# Authentication Module Documentation

## Overview

This documentation covers the Authentication module for the Cluster NestJS backend. The module handles user authentication using Ethereum-style signatures and JWT tokens.

## File Structure

1. `auth.module.ts`: Defines the AuthModule
2. `auth.decorator.ts`: Contains custom decorators for authentication
3. `auth.controller.ts`: Handles authentication-related HTTP requests
4. `auth.service.ts`: Implements authentication logic

## Detailed Component Breakdown

### 1. AuthModule (`auth.module.ts`)

```typescript
import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
```

This module:
- Imports `UsersModule` for user-related operations
- Declares `AuthController` as a controller
- Provides `AuthService` for authentication logic
- Exports `AuthService` for use in other modules

### 2. Custom Decorators (`auth.decorator.ts`)

#### UserInfo Decorator

```typescript
export const UserInfo = createParamDecorator<ReqUser>(
    async (data: unknown, ctx: ExecutionContext): Promise<ReqUser> => {
        const { user } = ctx.switchToHttp().getRequest()
        return user
    },
)
```

This decorator extracts the user information from the request object, allowing easy access to the authenticated user in route handlers.

#### Authenticated Decorator

```typescript
export const IS_AUTHENTICATED_KEY = 'isAuthenticated'
export const Authenticated = () =>
    applyDecorators(SetMetadata(IS_AUTHENTICATED_KEY, true), UseGuards(AuthGuard))
```

This decorator:
- Sets metadata to indicate that a route requires authentication
- Applies the `AuthGuard` to the route

### 3. AuthController (`auth.controller.ts`)

```typescript
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Body()
        loginDto: {
            address: `0x${string}`
            signature: `0x${string}`
            message: string
            referralCode?: string
        },
    ) {
        return this.authService.login(
            loginDto.address,
            loginDto.signature,
            loginDto.message,
            loginDto.referralCode,
        )
    }

    @Get('me')
    @Authenticated()
    async me(@Req() req: { user: any }) {
        return req.user
    }
}
```

This controller:
- Handles the `/auth/login` POST route for user login
- Provides a `/auth/me` GET route to retrieve the authenticated user's information
- Uses the `@Authenticated()` decorator to protect the `me` route

### 4. AuthService (`auth.service.ts`)

```typescript
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async getSigner(message, signature) {
        const messageHash = hashMessage(message);
        const signerAddress = await recoverMessageAddress({
            message:{raw: messageHash},
            signature
        });
        return signerAddress;
    }

    async validateSignature(
        address: `0x${string}`,
        signature: `0x${string}`,
        message: string,
    ): Promise<any> {
        const client = createPublicClient({
            chain: polygon,
            transport: http(),
        })
        const addressFromSignature = await this.getSigner(message, signature)
        const result = await client.verifyMessage({
            address,
            signature,
            message,
        })
        return {result, addressFromSignature}
    }

    async login(
        address: `0x${string}`,
        signature: `0x${string}`,
        message: string,
        referralCode?: string,
    ) {
        try {
            const isValid = await this.validateSignature(address, signature, message)
            if (isValid.result) {
                const referrer = !isEmpty(referralCode)
                    ? await this.usersService.findByReferralCode(referralCode)
                    : null
                let user = await this.usersService.findByAddress(address)
                if (!user) {
                    user = await this.usersService.create({
                        address,
                        referrer,
                        referral: '',
                    })
                }
                const payload = { address: user.address, id: user.id }
                return {
                    access_token: this.jwtService.sign(payload),
                    isValid: true,
                }
            }
            return { isValid: false, error: 'Invalid signature', addressFromSignature: isValid.addressFromSignature }
        } catch (error) {
            return { isValid: false, error: error.message}
        }
    }

    async verifyToken(token: string) {
        return this.jwtService.verify(token)
    }
}
```

This service:
- Implements Ethereum signature validation
- Handles user login and JWT token generation
- Manages user creation and referral processing
- Provides token verification

## Authentication Flow

1. **User Login**:
   - Client sends address, signature, message, and optional referral code
   - Server validates the signature using Ethereum cryptography
   - If valid, it creates or retrieves the user and generates a JWT token
   - Returns the token to the client

2. **Authenticated Requests**:
   - Client includes the JWT token in the Authorization header
   - `AuthGuard` (not shown in the provided code) validates the token
   - If valid, the request proceeds; otherwise, it's rejected

3. **User Information Retrieval**:
   - The `/auth/me` endpoint returns the current user's information
   - It's protected by the `@Authenticated()` decorator

## Example Usage

### Login Request

```http
POST /auth/login
Content-Type: application/json

{
  "address": "0x1234567890123456789012345678901234567890",
  "signature": "0xabcdef...",
  "message": "Login to Cluster",
  "referralCode": "FRIEND123"
}
```

### Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isValid": true
}
```

### Authenticated Request

```http
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Considerations

- The module uses Ethereum's cryptographic signatures for authentication, which is secure for blockchain-based applications.
- JWT tokens are used for maintaining session state, ensuring stateless authentication.
- The `AuthGuard` (not provided in the code) should implement proper token validation and expiration checks.
- Sensitive operations should always be protected with the `@Authenticated()` decorator.

## Potential Improvements

1. Implement token refresh mechanism for long-lived sessions.
2. Add rate limiting to prevent brute-force attacks on the login endpoint.
3. Implement more granular role-based access control.
4. Consider using environment variables for configuration (e.g., JWT secret).   

This authentication system provides a robust foundation for securing a blockchain-based application, leveraging Ethereum's cryptographic capabilities while providing familiar JWT-based session management.

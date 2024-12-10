# Activity Module Documentation

## Description
This module handles activity-related functionalities in the Cluster NestJS backend, focusing on cryptocurrency swap and transfer operations.

**Last Modified:** [Current Date]

## File Structure
- `activity.module.ts`: Module definition
- `activity.controller.ts`: HTTP request handlers
- `activity.dto.ts`: Data Transfer Objects
- `activity.service.ts`: Business logic implementation
- `activity.schema.ts`: MongoDB schema definition (not provided in the given code)

## Imports

The module uses various NestJS and external libraries:
- `@nestjs/common`: Core NestJS functionalities
- `@nestjs/mongoose`: MongoDB integration for NestJS
- `@nestjs/swagger`: Swagger/OpenAPI integration
- `@nestjs/axios`: HTTP client for external API calls
- `ofetch`: Lightweight fetch API wrapper

## Module Definition (activity.module.ts)

```typescript
@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: TokenList.name, schema: TokenListSchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
```

This module imports:
- `UsersModule`: For user-related operations
- `MongooseModule`: For MongoDB schema registration
- Defines `ActivityController` and `ActivityService` as the module's components

## Controllers (activity.controller.ts)

### ActivityController

Handles HTTP requests related to swap and transfer activities.

#### Endpoints:

1. **Create Swap**
   - Route: `POST /activity/swap`
   - Authentication: Required
   - Handler: `create()`

2. **Create Transfer**
   - Route: `POST /activity/transfer`
   - Authentication: Required
   - Handler: `transfer()`

3. **Get All Activities**
   - Route: `GET /activity`
   - Authentication: Required
   - Handler: `findAll()`
   - Query Parameters:
     - `type`: Array of activity types ('swap' or 'transfer')
     - `page`: Page number (default: 1)
     - `limit`: Items per page (default: 10)

4. **Get Gas Price**
   - Route: `GET /activity/gasPrice`
   - Authentication: Required
   - Handler: `getGasPrice()`
   - Query Parameters:
     - `chainId`: Blockchain network identifier

5. **OpenOcean Swap**
   - Route: `GET /activity/oo-swap`
   - Authentication: Not required (commented out)
   - Handler: `ooSwap()`
   - Query Parameters: Various swap-related parameters

## DTOs (activity.dto.ts)

### CreateSwapDto
Defines the structure for swap activity creation.

Properties:
- `tokenAName`: string
- `tokenBName`: string
- `tokenAAddress`: `0x${string}`
- `tokenBAddress`: `0x${string}`
- `amountA`: number
- `amountB`: number
- `txHash`: `0x${string}[]`
- `valueAinUSD`: number
- `valueBinUSD`: number

### CreateTransferDto
Defines the structure for transfer activity creation.

Properties:
- `tokenName`: string
- `tokenAddress`: `0x${string}`
- `to`: `0x${string}`
- `amount`: number
- `txHash`: `0x${string}[]`
- `valueInUSD`: number

## Services (activity.service.ts)

### ActivityService

Handles business logic for activity-related operations.

#### Methods:

1. **createTransfer()**
   - Creates a new transfer activity
   - Parameters: `userInfo: ReqUser, createActivityDto: CreateTransferDto`

2. **createSwap()**
   - Creates a new swap activity
   - Parameters: `userInfo: ReqUser, createActivityDto: CreateSwapDto`

3. **findAll()**
   - Retrieves activities for a user with pagination
   - Parameters: `userInfo: ReqUser, type: ("swap" | "transfer")[], page: number, limit: number`

4. **getGasPrice()**
   - Fetches gas price information from OpenOcean API
   - Parameters: `chainId: string`
   - Returns: Object with standard, fast, and instant gas prices

5. **ooSwap()**
   - Performs a swap quote request to OpenOcean API
   - Parameters: Various swap-related parameters
   - Returns: Swap quote data from OpenOcean

## Database Interactions

The service uses Mongoose models to interact with MongoDB:
- `ActivityModel`: For storing and retrieving activity data
- `UserModel`: For user-related operations (via `UsersService`)

Example query:
```typescript
await this.activityModel
  .find({ user: userInfo.id, type: { $in: type } })
  .skip((page - 1) * limit)
  .sort({ createdAt: -1 })
  .limit(limit)
  .exec();
```

## Cryptocurrency-Specific Features

1. **Swap Operations**
   - Handles cryptocurrency token swaps
   - Stores swap details including token addresses, amounts, and USD values

2. **Transfer Operations**
   - Manages cryptocurrency transfers
   - Records transfer details including recipient address and token information

3. **Gas Price Fetching**
   - Retrieves real-time gas prices for various blockchain networks
   - Supports Ethereum's EIP-1559 fee structure

4. **OpenOcean Integration**
   - Integrates with OpenOcean API for swap quotes
   - Provides optimal swap routes and pricing information

## Error Handling

The service includes basic error handling, particularly in the `ooSwap` method:

```typescript
try {
  // API call logic
} catch (error) {
  console.error("Error in ooSwap:", error);
  throw error;
}
```

## Configuration

The module relies on environment variables and configuration for:
- MongoDB connection (via `MongooseModule`)
- OpenOcean API endpoints

## Security Measures

1. **Authentication**
   - Most endpoints are protected with the `@Authenticated()` decorator
   - User information is retrieved using the `@UserInfo()` decorator

2. **Input Validation**
   - DTOs are used to validate input data structure
   - Swagger decorators provide additional API documentation and validation

## Related Documentation

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [OpenOcean API Documentation](https://docs.openocean.finance/)

This documentation provides a comprehensive overview of the Activity module in the Cluster NestJS backend, focusing on its cryptocurrency-related functionalities, API endpoints, data structures, and integration with external services like OpenOcean.

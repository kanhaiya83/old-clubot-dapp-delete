# Contact Management Module Documentation

## Overview
This documentation covers the Contact Management module for the Cluster NestJS backend. The module provides functionality for users to manage their contacts, including creating, reading, updating, and deleting contact information.

## File Structure
- `contact.module.ts`: Module definition
- `contact.controller.ts`: HTTP request handlers
- `contact.service.ts`: Business logic implementation
- `dto/create-contact.dto.ts`: Data Transfer Object for contact creation
- `dto/update-contact.dto.ts`: Data Transfer Object for contact updates
- `entities/contact.entity.ts`: MongoDB schema definition (not provided in the given code)

## Module: ContactModule

### File: `contact.module.ts`

```typescript
@Module({
    imports: [
        AuthModule,
        UsersModule,
        MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    ],
    controllers: [ContactController],
    providers: [ContactService],
    exports: [ContactService],
})
export class ContactModule {}
```

This module:
- Imports `AuthModule` for authentication
- Imports `UsersModule` for user-related operations
- Sets up Mongoose for the Contact model
- Declares `ContactController` and `ContactService`
- Exports `ContactService` for use in other modules

## DTOs (Data Transfer Objects)

### File: `dto/create-contact.dto.ts`

```typescript
export class CreateContactDto {
    name: string
    address: `0x${string}`
}
```

This DTO defines the structure for creating a new contact:
- `name`: The contact's name
- `address`: The contact's Ethereum address (must start with '0x')

### File: `dto/update-contact.dto.ts`

```typescript
export class UpdateContactDto extends PartialType(CreateContactDto) {}
```

This DTO extends `CreateContactDto` using `PartialType`, making all properties optional for updates.

## Controller: ContactController

### File: `contact.controller.ts`

This controller handles HTTP requests for contact operations.

#### Create Contact
```typescript
@Post()
@Authenticated()
create(@UserInfo() user: ReqUser, @Body() createContactDto: CreateContactDto) {
    return this.contactService.create(user, createContactDto)
}
```
- HTTP Method: POST
- Route: `/contact`
- Authentication: Required
- Creates a new contact for the authenticated user

#### Get All Contacts
```typescript
@Get()
@Authenticated()
findAll(@UserInfo() user: ReqUser) {
    return this.contactService.findAll(user)
}
```
- HTTP Method: GET
- Route: `/contact`
- Authentication: Required
- Retrieves all contacts for the authenticated user

#### Get Single Contact
```typescript
@Get(':id')
@Authenticated()
findOne(@UserInfo() user: ReqUser, @Param('id') id: string) {
    return this.contactService.findOne(user, id)
}
```
- HTTP Method: GET
- Route: `/contact/:id`
- Authentication: Required
- Retrieves a specific contact by ID for the authenticated user

#### Update Contact
```typescript
@Patch(':id')
@Authenticated()
update(
    @UserInfo() user: ReqUser,
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
) {
    return this.contactService.update(user, id, updateContactDto)
}
```
- HTTP Method: PATCH
- Route: `/contact/:id`
- Authentication: Required
- Updates a specific contact by ID for the authenticated user

#### Delete Contact
```typescript
@Delete(':id')
@Authenticated()
remove(@UserInfo() user: ReqUser, @Param('id') id: string) {
    return this.contactService.remove(user, id)
}
```
- HTTP Method: DELETE
- Route: `/contact/:id`
- Authentication: Required
- Deletes a specific contact by ID for the authenticated user

## Service: ContactService

### File: `contact.service.ts`

This service implements the business logic for contact operations.

#### Create Contact
```typescript
async create(userDta: ReqUser, createContactDto: CreateContactDto) {
    const existingContact = await this.contactModel
        .findOne({ user: userDta.id, address: createContactDto.address })
        .exec()
    if (existingContact) {
        throw new Error('Contact already exists')
    }
    const contact = new this.contactModel({
        ...createContactDto,
        user: userDta.id,
    })
    return await contact.save()
}
```
- Checks if a contact with the same address already exists for the user
- If not, creates and saves a new contact

#### Find All Contacts
```typescript
async findAll(userDta: ReqUser) {
    return await this.contactModel.find({ user: userDta.id }).exec()
}
```
- Retrieves all contacts for the given user

#### Find Contacts by Search Key
```typescript
async findAllBySearchKey(userDta: ReqUser, searchKey: string) {
    return await this.contactModel
        .find({
            user: userDta.id,
            $or: [
                { name: { $regex: searchKey, $options: 'i' } },
                { address: { $regex: searchKey, $options: 'i' } },
            ],
        })
        .exec()
}
```
- Searches for contacts matching the given search key in either name or address
- Case-insensitive search

#### Find One Contact
```typescript
async findOne(userDta: ReqUser, id: string) {
    const contact = await this.contactModel
        .findOne({ user: userDta.id, _id: id })
        .exec()
    if (!contact) {
        throw new Error('Contact not found')
    }
    return contact
}
```
- Retrieves a specific contact by ID for the given user
- Throws an error if the contact is not found

#### Update Contact
```typescript
async update(
    userDta: ReqUser,
    id: string,
    updateContactDto: UpdateContactDto,
) {
    const contact = await this.contactModel
        .findOne({ user: userDta.id, _id: id })
        .exec()
    if (!contact) {
        throw new Error('Contact not found')
    }
    return await this.contactModel
        .findByIdAndUpdate(
            id,
            { ...updateContactDto, user: userDta.id },
            { new: true },
        )
        .exec()
}
```
- Updates a specific contact by ID for the given user
- Throws an error if the contact is not found
- Returns the updated contact

#### Remove Contact
```typescript
async remove(userDta: ReqUser, id: string) {
    const contact = await this.contactModel
        .findOne({ user: userDta.id, _id: id })
        .exec()
    if (!contact) {
        throw new Error('Contact not found')
    }
    return await this.contactModel.findByIdAndDelete(id).exec()
}
```
- Deletes a specific contact by ID for the given user
- Throws an error if the contact is not found

## Error Handling
The service methods include basic error handling:
- Throwing errors for duplicate contacts or when a contact is not found
- These errors should be caught and handled appropriately in the controller or through NestJS exception filters

## Cryptocurrency-Specific Features
- The `address` field in the `CreateContactDto` is typed as ``0x${string}``, ensuring that it starts with '0x', which is typical for Ethereum addresses.
- The module allows users to manage contacts with cryptocurrency addresses, facilitating easier transactions within the Cluster ecosystem.

## Security Considerations
- All routes are protected with the `@Authenticated()` decorator, ensuring that only authenticated users can access contact information.
- User-specific data is isolated by including the user's ID in queries, preventing unauthorized access to other users' contacts.

## Potential Improvements
1. Implement pagination for the `findAll` method to handle large numbers of contacts efficiently.
2. Add validation for Ethereum addresses in the DTO or service layer.
3. Implement more robust error handling and custom exceptions.
4. Add logging for important operations and errors.

## Usage Example
To create a new contact:

```typescript
// In a service or controller
const newContact = await this.contactService.create(
    user,
    {
        name: "Alice",
        address: "0x1234567890123456789012345678901234567890"
    }
);
```

To find contacts by search:

```typescript
const searchResults = await this.contactService.findAllBySearchKey(user, "Ali");
```

This would return all contacts for the user where the name or address contains "Ali" (case-insensitive).

## Related Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Ethereum Address Format](https://ethereum.org/en/developers/docs/intro-to-ethereum/#ethereum-accounts)

This documentation provides a comprehensive overview of the Contact Management module, including its structure, functionality, and potential areas for improvement. It should serve as a valuable resource for developers working on or maintaining this part of the Cluster backend.

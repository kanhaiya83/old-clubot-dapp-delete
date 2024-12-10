# Cluster NestJS MongoDB Schema Documentation

## Overview
This document provides a comprehensive overview of the MongoDB schemas used in the Cluster NestJS backend. It covers four main schemas: User, Context, Contact, and Activity.

## Imports
All schemas use the following common imports:
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
```
The User schema additionally imports:
```typescript
import { hash } from 'ohash';
```

## Schemas

### 1. User Schema

#### Description
The User schema represents user accounts in the Cluster system.

#### Type Definitions
```typescript
export type UserDocument = User & Document;
export type ReqUser = {
    address: `0x${string}`;
    id: string;
};
```

#### Schema Definition
```typescript
@Schema({})
export class User {
    @Prop({ required: true, unique: true, index: true })
    address: `0x${string}`;

    @Prop({ required: false, index: true })
    referral: string;

    @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
    referrer: UserDocument | Types.ObjectId;
}
```

#### Fields
- `address`: Ethereum address of the user (required, unique, indexed)
- `referral`: User's referral code (optional, indexed)
- `referrer`: Reference to another user who referred this user (optional)

#### Pre-save Hook
The schema includes a pre-save hook to generate a referral code:
```typescript
UserSchema.pre('save', async function (next) {
    const user = this as UserDocument;
    if (!user.referral) {
        user.referral = hash(user.address).toUpperCase().slice(0, 6);
    }
    next();
});
```

#### Example
```typescript
const newUser = new User({
    address: '0x1234567890123456789012345678901234567890',
    // referral and referrer are optional
});
```

### 2. Context Schema

#### Description
The Context schema represents contextual information, possibly related to file management or versioning.

#### Type Definition
```typescript
export type ContextDocument = Context & Document;
```

#### Schema Definition
```typescript
@Schema({ timestamps: true })
export class Context {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    vectorId: string;

    @Prop({ required: true })
    currentFiles: string[];

    @Prop({ required: true })
    oldFiles: string[];
}
```

#### Fields
- `name`: Name of the context (required)
- `vectorId`: Identifier for a vector, possibly related to AI or data processing (required)
- `currentFiles`: Array of current file identifiers (required)
- `oldFiles`: Array of old file identifiers (required)

#### Example
```typescript
const newContext = new Context({
    name: 'ProjectX Context',
    vectorId: 'vec_123456',
    currentFiles: ['file1.txt', 'file2.jpg'],
    oldFiles: ['oldfile1.txt']
});
```

### 3. Contact Schema

#### Description
The Contact schema represents contact information associated with users.

#### Type Definition
```typescript
export type ContactDocument = Contact & Document;
```

#### Schema Definition
```typescript
@Schema({ timestamps: true })
export class Contact {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: true })
    address: `0x${string}`;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;
}
```

#### Fields
- `name`: Name of the contact (required)
- `description`: Description of the contact (optional)
- `address`: Ethereum address of the contact (required)
- `user`: Reference to the User who owns this contact (required)

#### Index
The schema includes a compound index for uniqueness:
```typescript
ContactSchema.index({ user: 1, address: 1 }, { unique: true });
```

#### Example
```typescript
const newContact = new Contact({
    name: 'John Doe',
    description: 'Colleague from Project Y',
    address: '0x9876543210987654321098765432109876543210',
    user: userObjectId // Reference to a User document
});
```

### 4. Activity Schema

#### Description
The Activity schema represents various activities performed by users, focusing on cryptocurrency transactions.

#### Type Definition
```typescript
export type ActivityDocument = Activity & Document;
```

#### Schema Definition
```typescript
@Schema({ timestamps: true })
export class Activity {
    @Prop({ required: true })
    user: Types.ObjectId;

    @Prop({ required: true, enum: ['swap', 'transfer'] })
    type: 'swap' | 'transfer';

    @Prop({ required: false })
    tokenName: string;

    @Prop({ required: false })
    tokenAddress: string;

    @Prop({ required: false })
    to: `0x${string}`;

    @Prop({ required: false })
    amount: number;

    @Prop({ required: false, type: [String]})
    txHash: `0x${string}`[];

    @Prop({ required: false })
    valueInUSD: number;

    @Prop({ required: false })
    tokenAName: string;

    @Prop({ required: false })
    tokenBName: string;

    @Prop({ required: false })
    tokenAAddress: `0x${string}`;

    @Prop({ required: false })
    tokenBAddress: `0x${string}`;

    @Prop({ required: false })
    amountA: number;

    @Prop({ required: false })
    amountB: number;

    @Prop({ required: false })
    valueAinUSD: number;

    @Prop({ required: false })
    valueBinUSD: number;
}
```

#### Fields
- `user`: Reference to the User performing the activity (required)
- `type`: Type of activity ('swap' or 'transfer') (required)
- Various fields for token details, transaction information, and USD values (all optional)

#### Examples

1. Transfer Activity:
```typescript
const transferActivity = new Activity({
    user: userObjectId,
    type: 'transfer',
    tokenName: 'Ethereum',
    tokenAddress: '0xETHADDRESS',
    to: '0xRECIPIENTADDRESS',
    amount: 1.5,
    txHash: ['0xTRANSACTIONHASH'],
    valueInUSD: 2500
});
```

2. Swap Activity:
```typescript
const swapActivity = new Activity({
    user: userObjectId,
    type: 'swap',
    tokenAName: 'Ethereum',
    tokenBName: 'USDC',
    tokenAAddress: '0xETHADDRESS',
    tokenBAddress: '0xUSDCADDRESS',
    amountA: 1,
    amountB: 1800,
    valueAinUSD: 1800,
    valueBinUSD: 1800,
    txHash: ['0xSWAPTRANSACTIONHASH']
});
```

## Conclusion
These schemas form the core data structure for the Cluster application, handling user management, context tracking, contact information, and activity logging, with a focus on cryptocurrency-related operations.

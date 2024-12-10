Here's an API overview and getting started introduction for the Cluster API based on the provided code:

# Cluster API Overview

## Introduction

The Cluster API is a NestJS-based backend service designed to support frontend applications. It provides a robust set of endpoints for managing users, authentication, contacts, contexts, activities, and an AI assistant.

## Key Features

- User management and authentication
- Contact management
- Context and activity tracking
- AI assistant integration
- MongoDB database integration
- JWT-based authentication
- Swagger API documentation

## Getting Started

### Configuration

Create a `.env` file in the root directory with the following variables:

```
COINGECKO_API_KEY=
DEBANK_API_KEY=
JWT_SECRET=
MONGODB_URI=
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
```

### API Documentation

Once the server is running, you can access the API documentation:

- Modern API Reference: `http://localhost:3005/api`
- Legacy Swagger UI: `http://localhost:3005/api-legacy-docs`

## Core Modules

1. **Auth Module**: Handles user authentication and JWT token management.
2. **Users Module**: Manages user accounts and profiles.
3. **Contact Module**: Handles contact information and management.
4. **Context Module**: Manages contextual information for the application.
5. **Activity Module**: Tracks and manages user activities.
6. **Assistant Module**: Integrates AI assistant functionalities.

## API Endpoints

The API provides various endpoints under these modules. Refer to the Swagger documentation for detailed information on available endpoints, request/response formats, and authentication requirements.

## Authentication

The API uses JWT for authentication. Include the JWT token in the `Authorization` header of your requests:

```
Authorization: Bearer your_jwt_token
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages in the response body for easier debugging and error handling on the client side.

## Customization and Extension

The modular architecture of NestJS allows for easy extension and customization of the API. New modules can be added, and existing ones can be modified to suit specific requirements.

## Support and Contribution

For support, please refer to the project's issue tracker. Contributions are welcome through pull requests.

---

This overview provides a high-level introduction to the Cluster API, its setup, and key features. It's designed to give developers a quick start in understanding and using the API. You may want to expand on specific sections or add more details about particular modules or features as needed for your project documentation.

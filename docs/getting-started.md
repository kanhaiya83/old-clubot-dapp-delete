# Getting Started with Cluster

Welcome to Cluster, an AI-powered bot for cryptocurrency and blockchain tasks. This guide will help you set up the project for development.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20 or later)
- pnpm (v9 or later)
- Git

## Clone the Repository

First, clone the Cluster repository:

```bash
git clone https://github.com/dappgenie/cluster.git
cd cluster
```

## Install Dependencies

Cluster uses pnpm for package management. Install the dependencies by running:

```bash
pnpm install
```

## Environment Setup

1. Copy the example environment variables to `.env` files in the `api` and `app` directories:

```bash

### backend
```bash
COINGECKO_API_KEY=
DEBANK_API_KEY=
JWT_SECRET=
MONGODB_URI=
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=

```
### frontend
```bash
VITE_APP_URL=
VITE_BASE_URL=

```

2. Open `.env` and fill in the necessary environment variables, including:
   - Database connection strings
   - API keys (e.g., OpenAI API key)
   - Any other required configuration

## Running the Project

Cluster is set up as a monorepo with separate frontend and backend applications.

### Start the Backend

To start the NestJS backend:

```bash
pnpm run -F api dev
```

The API will be available at `http://localhost:3005` by default.

### Start the Frontend

To start the React frontend:

```bash
pnpm run -F app dev
```

The frontend development server will start, typically at `http://localhost:5173`.

## Development Workflow

- Use `pnpm run -r build` to create production builds

## Exploring the Project Structure

- `/api`: Contains the NestJS backend code
- `/app`: Houses the React frontend application
- `/docs`: Project documentation
- `package.json`: Root package file for workspace configuration
- `pnpm-workspace.yaml`: Defines the monorepo workspace structure

Happy coding with Cluster!

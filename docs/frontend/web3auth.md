# `Web3AuthConnectorInstance.ts`

## Description
This file defines a function that creates and configures a Web3Auth connector instance for use with the Wagmi library in the Cluster project. It sets up Web3Auth for user authentication and blockchain interaction.

## Imports
- Web3Auth related libraries and components
- Wagmi chain types
- Ethereum provider and wallet services plugin

## Main Function: `Web3AuthConnectorInstance`

### Parameters
- `chains: Chain[]`: An array of blockchain networks supported by the application

### Configuration
1. **Chain Configuration**
   - Sets up the primary chain configuration based on the first chain in the provided array
   - Includes chain ID, RPC URL, display name, and explorer URL

2. **Web3Auth Instance**
   - Creates a new Web3Auth instance with the following key configurations:
     - Client ID (specific to the Cluster application)
     - Chain configuration
     - Session time (7 days)
     - UI configuration (app name, login methods, theme, etc.)
     - Network (SAPPHIRE_DEVNET)

3. **Wallet Services Plugin**
   - Adds a WalletServicesPlugin to the Web3Auth instance
   - Configures white-label options (hiding certain UI elements)

4. **Modal Configuration**
   - Sets up the configuration for the Web3Auth modal
   - Configures the OpenLogin adapter, including visibility of login methods

### Return Value
- Returns a Web3AuthConnector instance configured with the created Web3Auth instance and modal configuration

## Key Features
1. **Flexible Chain Support**: Dynamically configures the primary chain based on the provided chains array
2. **Customized UI**: Configures a custom UI for the Web3Auth modal, including branding and theme
3. **Extended Session**: Sets a 7-day session time for user convenience
4. **Wallet Services Integration**: Incorporates additional wallet services through a plugin
5. **Selective Login Methods**: Configures which login methods are displayed in the modal

## Notes
- The client ID used is specific to the Cluster project and should be kept secure
- The function uses the SAPPHIRE_DEVNET network, which might need to be adjusted for production use
- Error handling is not explicitly implemented in this function and might be managed at the usage level

## Usage Example
```typescript
import { mainnet, polygon } from 'wagmi/chains'
import Web3AuthConnectorInstance from './Web3AuthConnectorInstance'

const chains = [mainnet, polygon]
const web3AuthConnector = Web3AuthConnectorInstance(chains)

// Use web3AuthConnector in your Wagmi configuration
```

This function plays a crucial role in setting up the Web3Auth integration for the Cluster project, providing a seamless and customizable authentication experience for users interacting with blockchain functionalities.

# `ReceiveTokens.tsx`

## Description
This file contains the `ReceiveTokens` component for the Cluster project. It generates and displays a QR code for receiving cryptocurrency tokens, along with additional functionality for sharing and downloading the QR code.

## Imports
- React hooks and components
- QR code generation library
- Wallet connection hooks from `wagmi`
- Custom context, utilities, and components
- Third-party libraries for image conversion and sharing

## Component: ReceiveTokens

### Props
- `qrAddress`: String - The address to receive tokens
- `qrSelectedChain`: Object - Selected blockchain network information
- `qrAmount`: Number - Amount of tokens to receive (optional)
- `qrFunctionCall`: Object - Function call details for smart contract interaction (optional)

### State and Hooks
- `useState()`: Local state for QR code data
- `useContext(MyStore)`: Global state for selected chain
- `useAccount()`: For accessing wallet account information
- `useRef()`: For referencing the QR code element
- `useEffect()`: For generating QR code data and image conversion

### Main Functionality
1. QR Code Generation: Creates a QR code with encoded blockchain transaction data
2. Dynamic URL Parameters: Builds URL parameters based on provided props
3. Image Conversion: Converts QR code to downloadable image
4. Sharing: Enables sharing of the QR code and related information
5. Clipboard Copying: Allows copying of the wallet address

### Render
Returns a component with:
- QR code display
- Chain and address information
- Download, share, and external link buttons
- Conditional rendering based on the current path

## Key Features
- Supports multiple blockchain networks
- Generates EIP-681 compatible QR codes
- Allows for custom function calls in the QR code data
- Provides easy sharing and downloading of the QR code

## Usage Example
```jsx
import ReceiveTokens from './components/ReceiveTokens';

function WalletPage() {
  return (
    <div>
      <ReceiveTokens 
        qrAddress="0x123..."
        qrSelectedChain={{ name: "Ethereum", logo_url: "..." }}
        qrAmount={1.5}
      />
    </div>
  );
}
```

## Related Documentation
- [QRCode React Documentation](https://www.npmjs.com/package/qrcode.react)
- [Wagmi Hooks Documentation](https://wagmi.sh/react/hooks/useAccount)
- [EIP-681: URL Format for Transaction Requests](https://eips.ethereum.org/EIPS/eip-681)

This `ReceiveTokens` component is a crucial part of the Cluster project, enabling users to easily receive cryptocurrency tokens by generating and sharing QR codes. It supports various blockchain networks and can include custom function calls, making it versatile for different types of token transfers and smart contract interactions.

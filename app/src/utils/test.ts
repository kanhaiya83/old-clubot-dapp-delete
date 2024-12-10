// import { createConnector } from 'wagmi'
// import type { Config, ParticleNetwork } from '@particle-network/auth';
// import type { ParticleProvider } from '@particle-network/provider';
// import { Chain, SwitchChainError, UserRejectedRequestError, createWalletClient, custom, getAddress, numberToHex } from 'viem';

// type ParticleConnectorOptions = {
//   chains: Chain[];
//   options: Config;
// };

// const particleWalletConnector = ({ chains, options }: ParticleConnectorOptions) =>{
//   return createConnector((config) =>({
//     id: 'particle',
//     name: 'Particle',
//     async connect({ chainId }: { chainId?: number }) {
//       const [{ ParticleNetwork }, { ParticleProvider }] = await Promise.all([
//         import('@particle-network/auth'),
//         import('@particle-network/provider'),
//       ]);

//       const client = new ParticleNetwork();
//       const provider = new ParticleProvider(client.auth);

//       try {
//         if (!client.auth.isLogin()) {
//           await client.auth.login({
//             preferredAuthType: 'email',
//             supportAuthTypes: 'all',
//           });
//         }

//         const accounts = await provider.enable();
//         const account = getAddress(accounts[0] as string);
//         let id = await provider.request({ method: 'eth_chainId' }).then(Number);
//         let unsupported = chains.some((x) => x.id !== id);

//         if (chainId && id !== chainId) {
//           const chain = chains.find((x) => x.id === chainId);
//           if (!chain) throw new Error('Chain not found');

//           try {
//             await provider.request({
//               method: 'wallet_switchEthereumChain',
//               params: [{ chainId: numberToHex(chainId) }],
//             });
//             id = chainId;
//             unsupported = false;
//           } catch (switchError: any) {
//             if (switchError.code === 4902) {
//               // Handle chain addition (optional)
//             } else {
//               throw new SwitchChainError(switchError);
//             }
//           }
//         }

//         return {accounts}

//         return { account, chain: { id, unsupported } };
//       } catch (error: any) {
//         if (error.code === 4001) {
//           throw new UserRejectedRequestError(error);
//         }
//         throw error;
//       }
//     },
//     async disconnect() {
//       if (provider) {
//         provider.disconnect();
//       }
//     },
//     async getAccount() {
//       if (provider) {
//         const accounts = await provider.request({ method: 'eth_accounts' });
//         return getAddress(accounts[0] as string);
//       }
//       return null;
//     },
//     async getChainId() {
//       if (provider) {
//         return provider
//           .request({ method: 'eth_chainId' })
//           .then(Number);
//       }
//       return null;
//     },
//     async getWalletClient({ chainId }: { chainId?: number }) {
//       const account = await this.getAccount();
//       const chain = chains.find((x) => x.id === chainId);
//       if (provider && account) {
//         return createWalletClient({
//           account,
//           chain,
//           transport: custom(provider),
//         });
//       }
//       return null;
//     },
//     async isAuthorized() {
//       if (client) {
//         return client.auth.isLogin();
//       }
//       return false;
//     },
//   }));
// }

// export default particleWalletConnector;

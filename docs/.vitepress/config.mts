import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cluster Docs",
  description: "Code Documentions",
  themeConfig: {
    search: { provider: 'local' },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 dappgenie.io'
    },
    // https://vitepress.dev/reference/default-theme-config
    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          {
            text: 'Backend Docs',
            items: [
              { text: 'API Overview', link: '/backend/api-overview' },
              { text: 'Authentication', link: '/backend/authentication' },
              { text: 'Database Schema', link: '/backend/database-schema' },
              {
                text: 'Endpoints',
                collapsed: true,
                items: [
                  { text: 'User', link: '/backend/endpoints/user' },
                  {
                    text: 'Contact', link: '/backend/endpoints/contact'
                  },
                  {
                    text: 'Context', link: '/backend/endpoints/context'
                  },
                  {
                    text: 'Activity', link: '/backend/endpoints/activity'
                  },
                  {
                    text: 'Assistant', link: '/backend/endpoints/assistant'
                  },
                ]
              },
            ],
          },
          {
            text: 'React Documentation',
            items: [
              { text: 'Application Overview', link: '/frontend/app' },
              { text: 'Web3Auth Integration', link: '/frontend/web3auth' },
              { text: 'Token Transfer', link: '/frontend/send' },
              {
                text: 'Utility Functions',
                items: [
                  { text: 'Data Fetching', link: '/frontend/helper-functions/fetch-data' },
                  { text: 'Clipboard Operations', link: '/frontend/helper-functions/copy-to-clipboard' },
                  { text: 'Network Identification', link: '/frontend/helper-functions/get-network' },
                  { text: 'Token Information Retrieval', link: '/frontend/helper-functions/get-token-data' },
                ], collapsed: true
              },
              {
                text: 'Custom React Hooks',
                items: [
                  { text: 'useQuote', link: '/frontend/hooks/use-quote' },
                  { text: 'useSendToken', link: '/frontend/hooks/use-send-token' },
                  { text: 'useSwap', link: '/frontend/hooks/use-swap' },
                  { text: 'useWrapToken', link: '/frontend/hooks/use-wrap-token' },
                  { text: 'useApproveToken', link: '/frontend/hooks/use-approve-token' },
                  { text: 'useDataTransaction', link: '/frontend/hooks/use-data-transaction' },
                  { text: 'useNativeSendToken', link: '/frontend/hooks/use-native-send-token' },
                ],
                collapsed: true
              },
              {
                text: 'React Components',
                items: [
                  { text: 'Message Display', link: '/frontend/components/message' },
                  { text: 'Activity Tracker', link: '/frontend/components/activity' },
                  { text: 'User Authentication', link: '/frontend/components/login' },
                  { text: 'AI Assistant', link: '/frontend/components/bot' },
                  { text: 'Chat Interface', link: '/frontend/components/chat' },
                  { text: 'Chat Inbox', link: '/frontend/components/chat-inbox' },
                  { text: 'Chat List', link: '/frontend/components/chat-listing' },
                  { text: 'Wallet Connection', link: '/frontend/components/connect' },
                  { text: 'Token Reception', link: '/frontend/components/receive' },
                  { text: 'QR Code Generator', link: '/frontend/components/receive-qr' },
                  { text: 'Token Selection', link: '/frontend/components/select-tokens' },
                  { text: 'Transak Integration', link: '/frontend/components/transak' },
                  { text: 'Token Swap', link: '/frontend/components/swap' },
                  { text: 'User Profile', link: '/frontend/components/user-info' },
                  {
                    text: 'Additional Components',
                    items: [
                      { text: 'Token Balance Display', link: '/frontend/components/more/balance-tokens' },
                      { text: 'Contact Management', link: '/frontend/components/more/contacts' },
                      { text: 'Referral System', link: '/frontend/components/more/referrals' },
                      { text: 'More Options', link: '/frontend/components/more/more' },
                    ],
                    collapsed: true
                  },
                ],
                collapsed: true
              }
            ]
          },


        ]
      }
    ],
  }
})

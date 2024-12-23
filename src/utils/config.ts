import 'dotenv/config';
const config = {
  mainnet: {
    url: 'https://ctz.solidwallet.io/api/v3',
    nid: 1,
  },
  testnet: {
    url: 'https://lisbon.net.solidwallet.io/api/v3',
    nid: 2,
  },
  env: {
    network: process.env.NETWORK || 'testnet',
    pk: process.env.PRIVATE_KEY || null,
    receiver: process.env.RECEIVER_ADDRESS || null,
  },
};

export default config;

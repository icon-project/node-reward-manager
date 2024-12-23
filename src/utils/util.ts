import { Logger } from '@nestjs/common';
const logger = new Logger('Util');
import {
  JsonRpcInnerParams,
  JsonRpcRequest,
  JsonRpcOuterParams,
  IcxGetBalanceParams,
} from './types';
import config from './config';
import IconService from 'icon-sdk-js';
import { Wallet } from 'icon-sdk-js';

const {
  IconWallet,
  IconBuilder,
  HttpProvider,
  SignedTransaction,
  IconConverter,
} = IconService;

const NODE_URL = config[config.env.network].url;

export function getWallet(): Wallet {
  return IconWallet.loadPrivateKey(config.env.pk);
}

function getService() {
  const provider = new HttpProvider(NODE_URL);
  return new IconService(provider);
}

export async function claimIscoreTransaction(wallet: Wallet) {
  try {
    const service = getService();
    const transaction = new IconBuilder.CallTransactionBuilder()
      .from(wallet.getAddress())
      .to('cx0000000000000000000000000000000000000000')
      .stepLimit(IconConverter.toHex(1000000))
      .nid(config[config.env.network].nid)
      .nonce(IconConverter.toHex(1))
      .version(IconConverter.toHex(3))
      .timestamp(new Date().getTime() * 1000)
      .method('claimIScore')
      .build();

    const signedTransaction = new SignedTransaction(transaction, wallet);
    const txHash = service.sendTransaction(signedTransaction).execute();
    return txHash;
  } catch (err) {
    logger.log({
      level: 'error',
      message: err.message,
      error: err,
    });
    throw new Error('Failed to claim IScore');
  }
}

export async function sendIcxTransaction(
  wallet: Wallet,
  value: number,
  receiver: string,
) {
  try {
    const service = getService();
    const transaction = new IconBuilder.IcxTransactionBuilder()
      .from(wallet.getAddress())
      .to(receiver)
      .value(IconConverter.toHex(value * 10 ** 18))
      .stepLimit(IconConverter.toHex(1000000))
      .nid(config[config.env.network].nid)
      .nonce(IconConverter.toHex(1))
      .version(IconConverter.toHex(3))
      .timestamp(new Date().getTime() * 1000)
      .build();

    const signedTransaction = new SignedTransaction(transaction, wallet);
    const txHash = service.sendTransaction(signedTransaction).execute();
    return txHash;
  } catch (err) {
    logger.log({
      level: 'error',
      message: err.message,
      error: err,
    });
    throw new Error('Failed to send ICX');
  }
}

export async function customFetch(payload: JsonRpcRequest): Promise<any> {
  try {
    const res = await fetch(NODE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return await res.json();
  } catch (err) {
    logger.log({
      level: 'error',
      message: err.message,
      error: err,
    });
    throw new Error('Failed to fetch data');
  }
}

function buildJsonRpcRequest(
  rpcMethod: string,
  params: JsonRpcOuterParams | IcxGetBalanceParams,
): JsonRpcRequest {
  return {
    jsonrpc: '2.0',
    id: Math.floor(Math.random() * 1000000),
    method: rpcMethod,
    params: params,
  };
}

function buildIcxCallRequest(
  method: string,
  params: JsonRpcInnerParams,
): JsonRpcRequest {
  return buildJsonRpcRequest('icx_call', {
    to: 'cx0000000000000000000000000000000000000000',
    dataType: 'call',
    data: {
      method: method,
      params: params,
    },
  });
}

function buildIcxGetBalanceRequest(address: string): JsonRpcRequest {
  return buildJsonRpcRequest('icx_getBalance', { address: address });
}

export async function getIcxBalance(address: string): Promise<any> {
  try {
    const payload = buildIcxGetBalanceRequest(address);

    return customFetch(payload);
  } catch (err) {
    logger.log({
      level: 'error',
      message: err.message,
    });
    throw new Error('Failed to get ICX balance');
  }
}

export async function getIscore(address: string): Promise<any> {
  try {
    const payload = buildIcxCallRequest('queryIScore', {
      address: address,
    });

    return customFetch(payload);
  } catch (err) {
    logger.log({
      level: 'error',
      message: err.message,
    });
  }
  throw new Error('Failed to get IScore');
}

export function validateConfigs(configData = config): void {
  if (!configData.env.pk) {
    throw new Error('Missing private key');
  }

  if (!configData.env.network) {
    throw new Error('Missing network');
  }

  if (!configData.env.receiver) {
    throw new Error('Missing receiver address');
  }

  if (!configData[configData.env.network]) {
    throw new Error('Invalid network');
  }
}

export function parseFromLoopInHex(value: string): number {
  return parseInt(value, 16) / 10 ** 18;
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getReceiverAddress(): string {
  return config.env.receiver;
}

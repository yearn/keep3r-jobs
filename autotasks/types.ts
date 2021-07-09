import { RelayerParams } from 'defender-relay-client/lib/relayer';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';

export type WebhookRequest = {
  body?: object;
  queryParameters?: { [name: string]: string };
  headers?: { [name: string]: string };
};

// Secret key/value pairs
export type Secrets = {
  [name: string]: string;
};

type MatchReasons = Object;

type Sentinel = {
  id: string;
  name: string;
  abi: any[];
  address: string;
  confirmBlocks: number;
  network: string;
}

type AutoTaskEvent = {
  hash: string;
  transaction: TransactionReceipt,
  blockHash: string;
  blockNumber: BigNumber;
  timestamp: string;
  matchReasons: MatchReasons[];
  sentinel: Sentinel;
}

type AutoTaskRequest = WebhookRequest & {
  body: {
    events: AutoTaskEvent[];
  }
}

export type AutotaskEvent = RelayerParams & {
  secrets?: Secrets;
  request?: AutoTaskRequest;
};

export type Handler = (event: AutotaskEvent) => Promise<object | undefined>;

export type Matches = {
  hash: string,
  metadata?: Object
}[];

export type FlashBotBlock = {
  block_number: number,
  miner_reward: string,
  miner: string,
  coinbase_transfers: string,
  gas_used: number,
  gas_price: string,
  transactions: FlashBotTransactions[];
}

export type FlashBotTransactions = {
  transaction_hash: string;
  tx_index: number;
  bundle_index: number;
  block_number: number;
  eao_address: string;
  to_address: string;
  gas_used: number;
  gas_price: string;
  coinbase_transfer: string;
  total_miner_reward: string;
}
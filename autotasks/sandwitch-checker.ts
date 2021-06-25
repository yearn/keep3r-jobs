import { RelayerParams } from 'defender-relay-client/lib/relayer';
import { DefenderRelayProvider } from 'defender-relay-client/lib/ethers';
import _ from 'lodash';
import axios from 'axios';

type WebhookRequest = {
  body?: object;
  queryParameters?: { [name: string]: string };
  headers?: { [name: string]: string };
};

// Secret key/value pairs
type Secrets = {
  [name: string]: string;
};

type AutotaskEvent = RelayerParams & {
  secrets?: Secrets;
  request?: WebhookRequest;
};

type Handler = (event: AutotaskEvent) => Promise<object | undefined>;

type Matches = {
  hash: string
}[];

type FlashBotTransactions = {
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

const LIMIT = 5000;

const handler: Handler = async (autotaskEvent: AutotaskEvent): Promise<object | undefined> => {
  const body: any = autotaskEvent.request!.body;
  const matches: Matches = [];
  for (let i = 0; i < body.events.length; i++) {
    const event = body.events[i];
    const flashBotLastTXsRequest = await axios.get(`https://blocks.flashbots.net/v1/transactions?limit=${LIMIT}`);
    const { transactions } = (flashBotLastTXsRequest.data as { transactions: FlashBotTransactions[] });
    const flashbotTx = _.find(
      transactions, 
      (transaction: FlashBotTransactions) => 
        transaction.transaction_hash.toLowerCase() === event.transaction.transactionHash.toLowerCase()
    );
    if (!!flashbotTx) matches.push({ hash: event.hash });
  }
  return { matches };
};

export { handler };
export const id = 'f9efd7dd-7197-49d2-8c15-519682a14e87';

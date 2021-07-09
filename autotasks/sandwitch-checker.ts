import axiosRetry from 'axios-retry';
import _ from 'lodash';
import axios from 'axios';
import { AutotaskEvent, FlashBotBlock, FlashBotTransactions, Handler, Matches } from './types';
import { BigNumber } from 'ethers';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const handler: Handler = async (autotaskEvent: AutotaskEvent): Promise<object | undefined> => {
  const body = autotaskEvent.request!.body;
  const matches: Matches = [];
  for (let i = 0; i < body.events.length; i++) {
    const event = body.events[i];
    const blockNumber = BigNumber.from(event.transaction.blockNumber).toString();
    const flashBotMyTxBlockRequest = await axios.get(`https://blocks.flashbots.net/v1/blocks?block_number=${blockNumber}&limit=1`);
    const { blocks } = (flashBotMyTxBlockRequest.data as { blocks: FlashBotBlock[] });
    if (blocks.length == 0) {
      console.log('Tx was not in a flashbot block');
      return;
    }
    const { transactions } = blocks[0];
    const flashbotTx = _.find(
      transactions, 
      (transaction: FlashBotTransactions) => 
        transaction.transaction_hash.toLowerCase() === event.transaction.transactionHash.toLowerCase()
    );
    if (!flashbotTx) {
      console.log('Couldn\'t find our tx in flashbot block');
      return;
    }
    const bundledTxs = _.filter(
      transactions,
      (transaction: FlashBotTransactions) => 
        transaction.bundle_index === flashbotTx.bundle_index
    );
    if (flashbotTx.tx_index != 0 || bundledTxs.length > 1) {
      matches.push({ 
        hash: event.hash,
        metadata: {
          block: `https://blocks.flashbots.net/v1/blocks?block_number=${blockNumber}&limit=1`
        }
      });
    } else {
      console.log('Tx didn\'t seem to be sandwitched');
    }
  }
  return { matches };
};

export { handler };
export const id = 'f9efd7dd-7197-49d2-8c15-519682a14e87';

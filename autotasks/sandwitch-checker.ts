import { RelayerParams } from 'defender-relay-client/lib/relayer';
import { DefenderRelayProvider } from 'defender-relay-client/lib/ethers';
import { BigNumber } from 'ethers';

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

const UPPER_BOUND = 15;
const LOWER_BOUND = 0;

const handler: Handler = async (autotaskEvent: AutotaskEvent): Promise<object | undefined> => {
  const provider = new DefenderRelayProvider(autotaskEvent);
  const body: any = autotaskEvent.request!.body;
  const matches: Matches = [];
  for (let i = 0; i < body.events.length; i++) {
    const event = body.events[i];
    const tx = (await provider.getTransaction(event.transaction.transactionHash) as any);
    const transactionIndex = BigNumber.from(tx.transactionIndex);
    if (
      (transactionIndex.gte(LOWER_BOUND) && transactionIndex.lte(UPPER_BOUND)) ||
      tx.gasPrice.eq(0)
    ) {
      matches.push({
        hash: event.hash
      });
    }
  }
  return { matches };
};

export { handler };
export const id = 'f9efd7dd-7197-49d2-8c15-519682a14e87';

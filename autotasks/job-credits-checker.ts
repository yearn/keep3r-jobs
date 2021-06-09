import { RelayerParams } from 'defender-relay-client/lib/relayer';
import { DefenderRelaySigner, DefenderRelayProvider } from 'defender-relay-client/lib/ethers';
import { ethers, utils } from 'ethers';

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

const threshold = utils.parseEther('10');

const keep3r = '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44';

export const id = 'b785639b-f76d-482b-bb5c-675e4eca9f39';

const handler: Handler = async (event: AutotaskEvent): Promise<object | undefined> => {
  const provider = new DefenderRelayProvider(event);
  const signer = new DefenderRelaySigner(event, provider, { speed: 'fast' });
  const body: any = event.request!.body;
  const abi = body.events[0].sentinel.abi;
  const contract = new ethers.Contract(keep3r, abi, signer);
  const matches = [];
  for (let i = 0; i < body.events.length; i++) {
    const event = body.events[i];
    const jobCredits = await contract.credits(event.matchReasons.params.job, keep3r);
    if (threshold.gte(jobCredits)) {
      matches.push({
        hash: event.hash,
        metadata: {
          sentinel: event.sentinel.name,
        },
      });
    }
  }
  return { matches };
};

export { handler };

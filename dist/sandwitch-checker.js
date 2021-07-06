"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = exports.handler = void 0;
const axios_retry_1 = __importDefault(require("axios-retry"));
const lodash_1 = __importDefault(require("lodash"));
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
axios_retry_1.default(axios_1.default, { retries: 3, retryDelay: axios_retry_1.default.exponentialDelay });
const handler = async (autotaskEvent) => {
    const body = autotaskEvent.request.body;
    const matches = [];
    for (let i = 0; i < body.events.length; i++) {
        const event = body.events[i];
        const blockNumber = ethers_1.BigNumber.from(event.transaction.blockNumber).toString();
        const flashBotMyTxBlockRequest = await axios_1.default.get(`https://blocks.flashbots.net/v1/blocks?block_number=${blockNumber}&limit=1`);
        const { blocks } = flashBotMyTxBlockRequest.data;
        if (blocks.length == 0) {
            console.log('Tx was not in a flashbot block');
            return;
        }
        const { transactions } = blocks[0];
        const flashbotTx = lodash_1.default.find(transactions, (transaction) => transaction.transaction_hash.toLowerCase() === event.transaction.transactionHash.toLowerCase());
        if (!flashbotTx) {
            console.log('Couldn\'t find our tx in flashbot block');
            return;
        }
        const bundledTxs = lodash_1.default.filter(transactions, (transaction) => transaction.bundle_index === flashbotTx.bundle_index);
        if (flashbotTx.tx_index != 0 || bundledTxs.length > 1) {
            matches.push({
                hash: event.hash,
                metadata: {
                    block: `https://blocks.flashbots.net/v1/blocks?block_number=${blockNumber}&limit=1`
                }
            });
        }
        else {
            console.log('Tx didn\'t seem to be sandwitched');
        }
    }
    return { matches };
};
exports.handler = handler;
exports.id = 'f9efd7dd-7197-49d2-8c15-519682a14e87';

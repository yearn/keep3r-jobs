"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = exports.handler = void 0;
const lodash_1 = __importDefault(require("lodash"));
const axios_1 = __importDefault(require("axios"));
const LIMIT = 5000;
const handler = async (autotaskEvent) => {
    const body = autotaskEvent.request.body;
    const matches = [];
    for (let i = 0; i < body.events.length; i++) {
        const event = body.events[i];
        const flashBotLastTXsRequest = await axios_1.default.get(`https://blocks.flashbots.net/v1/transactions?limit=${LIMIT}`);
        const { transactions } = flashBotLastTXsRequest.data;
        const flashbotTx = lodash_1.default.find(transactions, (transaction) => transaction.transaction_hash.toLowerCase() === event.transaction.transactionHash.toLowerCase());
        if (!!flashbotTx) {
            const bundledTxs = lodash_1.default.filter(transactions, (transaction) => transaction.bundle_index === flashbotTx.bundle_index);
            if (flashbotTx.tx_index != 0 || bundledTxs.length > 1) {
                matches.push({
                    hash: event.hash
                });
            }
        }
    }
    return { matches };
};
exports.handler = handler;
exports.id = 'f9efd7dd-7197-49d2-8c15-519682a14e87';

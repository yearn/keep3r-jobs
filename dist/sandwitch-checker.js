"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = exports.handler = void 0;
const ethers_1 = require("defender-relay-client/lib/ethers");
const ethers_2 = require("ethers");
const UPPER_BOUND = 15;
const LOWER_BOUND = 0;
const handler = async (autotaskEvent) => {
    const provider = new ethers_1.DefenderRelayProvider(autotaskEvent);
    const body = autotaskEvent.request.body;
    const matches = [];
    for (let i = 0; i < body.events.length; i++) {
        const event = body.events[i];
        const tx = await provider.getTransaction(event.transaction.transactionHash);
        const transactionIndex = ethers_2.BigNumber.from(tx.transactionIndex);
        if ((transactionIndex.gte(LOWER_BOUND) && transactionIndex.lte(UPPER_BOUND)) ||
            tx.gasPrice.eq(0)) {
            matches.push({
                hash: event.hash
            });
        }
    }
    return { matches };
};
exports.handler = handler;
exports.id = 'f9efd7dd-7197-49d2-8c15-519682a14e87';

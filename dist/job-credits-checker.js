"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.id = void 0;
const ethers_1 = require("defender-relay-client/lib/ethers");
const ethers_2 = require("ethers");
const threshold = ethers_2.utils.parseEther('10');
const keep3r = '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44';
exports.id = 'b785639b-f76d-482b-bb5c-675e4eca9f39';
const handler = async (event) => {
    const provider = new ethers_1.DefenderRelayProvider(event);
    const signer = new ethers_1.DefenderRelaySigner(event, provider, { speed: 'fast' });
    const body = event.request.body;
    const abi = body.events[0].sentinel.abi;
    const contract = new ethers_2.ethers.Contract(keep3r, abi, signer);
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
exports.handler = handler;

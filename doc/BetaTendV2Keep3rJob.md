# BetaTendV2Keep3rJob

- address: [`0xf72D7E44ec3F79379912B8d0f661bE954a101159`](https://etherscan.io/address/0xf72D7E44ec3F79379912B8d0f661bE954a101159#code)

> to add a new strategies create a PR with the added strategies below

> remember to set the `keeper` role to `0x736D7e3c5a6CB2CE3B764300140ABF476F6CFCCF` (`V2Keep3r`)

### strategies:



### work requirements:

- keeper should at least have **50 KP3R bonded**
- keeper should **not be a contract**

### work script:

```ts
// ABIs at: https://etherscan.io/address/0x7b28163e7a3db17ef2dba02bcf7250a8dc505057#code
// Important! use callStatic for all methods (even work) to avoid spending gas
// only send work transaction if callStatic.work succeeded,
// even if workable is true, the job might not have credits to pay and the work tx will revert
const strategies = await YearnBetaTendV2Keep3rJob.callStatic.strategies();
for (const strategy of strategies) {
    const workable = await YearnBetaTendV2Keep3rJob.callStatic.workable(strategy);
    console.log({ strategy, workable });
    if (!workable) continue;
    await YearnBetaTendV2Keep3rJob.connect(keeper).callStatic.work(strategy);
    await YearnBetaTendV2Keep3rJob.connect(keeper).work(strategy);
    console.log('worked!');
}
```

# HarvestV2QueueKeep3rJob

- address: [`0xE5a7db399dEC2c5ddEfeBc52ea70f127284D118d`](https://etherscan.io/address/0xE5a7db399dEC2c5ddEfeBc52ea70f127284D118d#code)

> to add new strategies queues create a PR with the added strategies queues below

> remember to set the `keeper` role to `0x736D7e3c5a6CB2CE3B764300140ABF476F6CFCCF` (`V2Keep3r`)

### strategies queues:


- `StrategyMakerETHDAIDelegate`: 
    - 1 `StrategyLenderYieldOptimiser`
        - address: [`0x32b8C26d0439e1959CEa6262CBabC12320b384c4`](https://etherscan.io/address/0x32b8C26d0439e1959CEa6262CBabC12320b384c4#code)
        - requiredAmount: `2_500_000`
    - 2 `StrategyIdleidleDAIYield`
        - address: [`0x9f51F4df0b275dfB1F74f6Db86219bAe622B36ca`](https://etherscan.io/address/0x9f51F4df0b275dfB1F74f6Db86219bAe622B36ca#code)
        - requiredAmount: `2_500_000`
    - 3 `StrategyGenericLevCompFarm`
        - address: [`0x4031afd3B0F71Bace9181E554A9E680Ee4AbE7dF`](https://etherscan.io/address/0x4031afd3B0F71Bace9181E554A9E680Ee4AbE7dF#code)
        - requiredAmount: `2_500_000`
    - 4 `IBLevComp`
        - address: [`0x77b7CD137Dd9d94e7056f78308D7F65D2Ce68910`](https://etherscan.io/address/0x77b7CD137Dd9d94e7056f78308D7F65D2Ce68910#code)
        - requiredAmount: `2_500_000`
    - 5 `PoolTogetherDaiStablecoin`
        - address: [`0x57e848A6915455a7e77CF0D55A1474bEFd9C374d`](https://etherscan.io/address/0x57e848A6915455a7e77CF0D55A1474bEFd9C374d#code)
        - requiredAmount: `2_500_000`
    - 6 `StrategyMakerETHDAIDelegate`
        - address: [`0x0E5397B8547C128Ee20958286436b7BC3f9faAa4`](https://etherscan.io/address/0x0E5397B8547C128Ee20958286436b7BC3f9faAa4#code)
        - requiredAmount: `1_500_000`



### work requirements:

- keeper should at least have **50 KP3R bonded**
- keeper should **not be a contract**

### work script:

```ts
// ABIs at: https://etherscan.io/address/0xE5a7db399dEC2c5ddEfeBc52ea70f127284D118d#code
// Important! use callStatic for all methods (even workable and work) to avoid spending gas
// only send work transaction if callStatic.work succeeded,
// even if workable is true, the job might not have credits to pay and the work tx will revert
const strategies = await HarvestV2QueueKeep3rJob.callStatic.strategies();
for (const strategy of strategies) {
    const workable = await HarvestV2QueueKeep3rJob.callStatic.workable(strategy);
    console.log({ strategy, workable });
    if (!workable) continue;
    await HarvestV2QueueKeep3rJob.connect(keeper).callStatic.work(strategy);
    await HarvestV2QueueKeep3rJob.connect(keeper).work(strategy);
    console.log('worked!');
}
```

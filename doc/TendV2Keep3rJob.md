# TendV2Keep3rJob

- address: [`0x7b28163e7a3db17eF2dba02BCf7250A8Dc505057`](https://etherscan.io/address/0x7b28163e7a3db17eF2dba02BCf7250A8Dc505057#code)

> to add a new strategies create a PR with the added strategies below

### strategies:

- `StrategyMakerYFIDAIDelegate`:
    - address: [`0x4730D10703155Ef4a448B17b0eaf3468fD4fb02d`](https://etherscan.io/address/0x4730D10703155Ef4a448B17b0eaf3468fD4fb02d#code)
    - requiredAmount: `100_000_000_000_000_000`
- `StrategyMakerETHDAIDelegate`:
    - address: [`0x0E5397B8547C128Ee20958286436b7BC3f9faAa4`](https://etherscan.io/address/0x0E5397B8547C128Ee20958286436b7BC3f9faAa4#code)
    - requiredAmount: `100_000_000_000_000_000`

### work requirements:

- keeper should at least have **50 KP3R bonded**
- keeper should **not be a contract**

### work script:

```ts
// ABIs at: https://etherscan.io/address/0x7b28163e7a3db17ef2dba02bcf7250a8dc505057#code
// Important! use callStatic for all methods (even work) to avoid spending gas
// only send work transaction if callStatic.work succeeded,
// even if workable is true, the job might not have credits to pay and the work tx will revert
const strategies = await YearnTendV2Keep3rJob.callStatic.strategies();
for (const strategy of strategies) {
    const workable = await YearnTendV2Keep3rJob.callStatic.workable(strategy);
    console.log({ strategy, workable });
    if (!workable) continue;
    await YearnTendV2Keep3rJob.connect(keeper).callStatic.work(strategy);
    await YearnTendV2Keep3rJob.connect(keeper).work(strategy);
    console.log('worked!');
}
```

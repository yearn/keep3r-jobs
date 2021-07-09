# HarvestV2Keep3rStealthJob

- address: [`0x2150b45626199CFa5089368BDcA30cd0bfB152D6`](https://etherscan.io/address/0x2150b45626199CFa5089368BDcA30cd0bfB152D6#code)

> to add a new strategies create a PR with the added strategies below

> remember to set the `keeper` role to `0x736D7e3c5a6CB2CE3B764300140ABF476F6CFCCF` (`V2Keep3r`)

### strategies:



### work requirements:

- keeper should at least have **50 KP3R bonded**
- keeper should **not be a contract**
- keeper should at least have **10 ETH bonded on [YearnStealthVault]**
- keeper should send their txs though [YearnStealthRelayer]
  - please read [working stealth jobs](./working-stealth-jobs.md) for more information

### work script:
> please read [working stealth jobs](./working-stealth-jobs.md) for more information

```ts
const strategies = await HarvestV2Keep3rStealthJob.callStatic.strategies();
for (const strategy of strategies) {
    const workable = await HarvestV2Keep3rStealthJob.callStatic.workable(strategy);
    console.log({ strategy, workable });
    if (!workable) continue;

    // First, grab the data for the underlying tx
    const rawTx = await HarvestV2Keep3rStealthJob.connect(alice).populateTransaction.work(strategy);
    const callData = rawTx.data;

    // then generate a random string and compact it into 32 bytes
    const stealthHash = ethers.utils.solidityKeccak256(['string'], ['replace-with-random-secret-hash']);
    // then get the block number (useful for bandit attack protection)
    let blockNumber = await ethers.provider.getBlockNumber();
    const pendingBlock = await ethers.provider.send("eth_getBlockByNumber", ["latest", false])
    const blockGasLimit = BigNumber.from(pendingBlock.gasLimit);

    await stealthRelayer.connect(alice).callStatic.execute(
      HarvestV2Keep3rStealthJob.address, // address _job,
      callData, // bytes memory _callData,
      stealthHash, // bytes32 _stealthHash,
      blockNumber + 1, // uint256 _blockNumber
      { gasLimit: blockGasLimit.sub(15_000) } // 15k should be more than enough to cover for block's gasLimit reduction
    );

    // and finally execute your tx. (this step can be changed to use flashbots, see `working-stealth-jobs` guide)
    // [Important] If you do NOT use flashbots, make sure to be using a private-mempool, such as Taichi, or you'll lose your bond.
    await stealthRelayer.connect(alice).execute(
      HarvestV2Keep3rStealthJob.address, // address _job,
      callData, // bytes memory _callData,
      stealthHash, // bytes32 _stealthHash,
      blockNumber + 1, // uint256 _blockNumber
      { gasLimit: blockGasLimit.sub(15_000) } // 15k should be more than enough to cover for block's gasLimit reduction
    );

    console.log('worked!');
}
   
```

# CrvStrategyKeep3rJob2

- address: [`0xeE15010105b9BB564CFDfdc5cee676485092AEDd`](https://etherscan.io/address/0xeE15010105b9BB564CFDfdc5cee676485092AEDd#code)

> to add a new strategies create a PR with the added strategies below

### V2 strategies:

- `LUSD`:
    - address: [`0x21e5a745d77430568C074569C06e6c765922626a`](https://etherscan.io/address/0x21e5a745d77430568C074569C06e6c765922626a#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `yUSD`:
    - address: [`0x6d45c5a8C1cF1f77Ab89cAF8D44917730298bab7`](https://etherscan.io/address/0x6d45c5a8C1cF1f77Ab89cAF8D44917730298bab7#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `y3CRV`:
    - address: [`0x9d7c11D1268C8FD831f1b92A304aCcb2aBEbfDe1`](https://etherscan.io/address/0x9d7c11D1268C8FD831f1b92A304aCcb2aBEbfDe1#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `GUSD`:
    - address: [`0x9C1117cf2ED3A0F4A9F069001F517c1D511c8B53`](https://etherscan.io/address/0x9C1117cf2ED3A0F4A9F069001F517c1D511c8B53#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `FRAX`:
    - address: [`0xb622F17e1ba8C51b9BD760Fb37994a55b1e5CD85`](https://etherscan.io/address/0xb622F17e1ba8C51b9BD760Fb37994a55b1e5CD85#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `Compound`:
    - address: [`0xdDAAc8B5Dd65d079b6572e43890BDD8d95bD5cc3`](https://etherscan.io/address/0xdDAAc8B5Dd65d079b6572e43890BDD8d95bD5cc3#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `yBUSD`:
    - address: [`0xB3E1a513a2fE74EcF397dF9C0E6BCe5B57A961C8`](https://etherscan.io/address/0xB3E1a513a2fE74EcF397dF9C0E6BCe5B57A961C8#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `sAave`:
    - address: [`0xE73817de3418bB44A4FeCeBa53Aa835333C550e7`](https://etherscan.io/address/0xE73817de3418bB44A4FeCeBa53Aa835333C550e7#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `TUSD`:
    - address: [`0xE7C32D413341bfc84BB58492BEA8a69e8D06E0b4`](https://etherscan.io/address/0xE7C32D413341bfc84BB58492BEA8a69e8D06E0b4#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `BUSDv2`:
    - address: [`0x687C424F6CB4Be24587af6c7E85CA33d5015938d`](https://etherscan.io/address/0x687C424F6CB4Be24587af6c7E85CA33d5015938d#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`
- `DUSD`:
    - address: [`0x4C547b6202247E7B7c45A95d7747A85704530ab3`](https://etherscan.io/address/0x4C547b6202247E7B7c45A95d7747A85704530ab3#code)
    - requiredHarvest: `10_000_000000000000000000`
    - requiredEarn: `100_000000000000000000`


### work requirements:

- keeper should at least have **50 KP3R bonded**
- keeper should **not be a contract**

### work script:

```ts
// ABIs at: https://etherscan.io/address/0xeE15010105b9BB564CFDfdc5cee676485092AEDd#code
// Important! use callStatic for all methods (even work) to avoid spending gas
// only send work transaction if callStatic.work succeeded,
// even if workable is true, the job might not have credits to pay and the work tx will revert
const strategies = await CrvStrategyKeep3rJob2.callStatic.strategies();
for (const strategy of strategies) {
    const workable = await CrvStrategyKeep3rJob2.callStatic.workable(strategy);
    console.log({ strategy, workable });
    if (!workable) continue;
    await CrvStrategyKeep3rJob2.connect(keeper).callStatic.work(strategy);
    await CrvStrategyKeep3rJob2.connect(keeper).work(strategy);
    console.log('worked!');
}
```

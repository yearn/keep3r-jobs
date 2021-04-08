# YearnKeep3rV2OracleFactory

- address: [`0xcEA967B693e89B1FFb08718c3106847616e95607`](https://etherscan.io/address/0xcEA967B693e89B1FFb08718c3106847616e95607#code)

> to add a new pair(s) create a PR with the added pair(s) below

### pairs:

- `uni_YFI-ETH`: [`0x2fdbadf3c4d5a8666bc06645b8358ab803996e28`](https://etherscan.io/token/0x2fdbadf3c4d5a8666bc06645b8358ab803996e28)

- `sushi_YFI-ETH`: [`0x088ee5007c98a9677165d78dd2109ae4a3d04d0c`](https://etherscan.io/token/0x088ee5007c98a9677165d78dd2109ae4a3d04d0c)


### work requirements:

- keeper should at least have **0 KP3R bonded**

### work script:

```ts
// ABIs at: https://etherscan.io/address/0xcEA967B693e89B1FFb08718c3106847616e95607#code
// Important! use callStatic for all methods (even work) to avoid spending gas
// only send work transaction if callStatic.work succeeded,
// even if workable is true, the job might not have credits to pay and the work tx will revert
const workable = await YearnKeep3rV2OracleFactory.callStatic.workable();
await YearnKeep3rV2OracleFactory.connect(keeper).callStatic.work();
await YearnKeep3rV2OracleFactory.connect(keeper).work();
console.log('worked!');
```

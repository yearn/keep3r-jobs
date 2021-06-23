# Working Stealth Jobs

**[YearnStealthVault](https://etherscan.io/address/0xYearnStealthVault#code)**

**[YearnStealthRelayer](https://etherscan.io/address/0xYearnStealthRelayer#code)**



### How to bond:

- to add bonds tou need to call (bond) with as much ETH (msg.value) as you'd like to bond.
    - check amount being bonded is higher than the penalty of the job you want to perform work on

- call `enableStealthJob(address _job)` with `_job` being the address of the job you with to perform work on
    - in this case `0xYearnStealthRelayer` (YearnStealthRelayer)
    - you can also use `enableStealthJobs(address[] calldata _jobs)`
    - this is required since jobs have the ability to take your bond away.
        - so, please be careful and only enable jobs after reviewing them.

- to remove a job from your list just call `disableStealthJob(address _job)`
    - you can also use `disableStealthJobs(address[] calldata _jobs)`

- to unbond, call (startUnbond), wait 4 days, and call (unbond | unbondAll).
    - in this period you'll not be able to perform any work
    - to cancel unbond and continue working call (cancelUnbond)

### How to work:

- here is an example on how to call a job though `StealthRelayer`:
```ts
    // First, grab the data for the underlying tx
    const rawTx = await stealthERC20.connect(alice).populateTransaction.stealthMint(alice.address, mintAmount);
    const callData = rawTx.data;

    // then generate a random string and compact it into 32 bytes
    const stealthHash = ethers.utils.solidityKeccak256(['string'], ['random-secret-hash']);
    // then get the block number (useful for bandit attack protection)
    let blockNumber = await ethers.provider.getBlockNumber();

    // and finally execute your tx. (this step can be changed to use flashbots, see guide below)
    await stealthRelayer.connect(alice).execute(
      stealthERC20.address, // address _job,
      callData, // bytes memory _callData,
      stealthHash, // bytes32 _stealthHash,
      blockNumber + 1 // uint256 _blockNumber
    );
```

### Risks:

- at any point in time governance can take your bond away.
- if the private mempool service you were using leaks your tx, you can get your bond slashed.
    - you stilll might be able to recover up to 90% of the penalty if there was no harm done.


### Requirements:

- interacting with the StealthRelayer **MUST ALWAYS** be done using an EOA.
    - failure to comply with this requirement will result in instant and unreversable slashing of all your bond.

- we suggest you use Flashbots to avoid getting charged on reverted txs, but you can use whatever private mempool service you desire.
    - here is a sample script (TBD)
    - [IMPORTANT] take into account that if we see any abuse or irregular activity, i.e. tx-sandwitching, you might lose both your StealthVault and Keep3r bonds.

### Being a watcher:

Being a watcher for the StealthRelayer implies you need to constantly monitor mempool transactions, and report any public tx you might see that will earn you a percentage of the keeper bond.

view bonded-stealth-txs script for sample code. TBD


### Reporting errors

To report errors, bugs or security concerns you can reach us at Yearn's discord server, under the Keep3r channel.
For security concerns/exploits please raise the issue without discosing the details, and we'll get in touch with you over the discord channel so we can establish a secure line of communication. Bounty rewards will be assigned to you for your work.

### Disputing slashing

If you feel you have been mistakenly slash please reach to us over yearn's discord server or though yearn's keep3r forum.
Remember 10% of your slashed bond will not be refunded, since it was used to reward the watcher who reported the tx-hash.

In some cases even if you got slashed while acting in good faith, and the underlying job was not harmed, you can get up to 90% of the penalty back.

In the other hand, if you are a job, and your protocol got affected by a keeper, you can present evidence and ask though discord to slash the keeper bonds (on Keep3r and/or StealthVault)

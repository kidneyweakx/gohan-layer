# Gohan Layer

## Using this example

Run the following command:

```sh
pnpm dlx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Sequence Diagram
```mermaid
sequenceDiagram
    actor U as User
    actor M as Miner
    participant C as MinerToken
    participant L as LendingPool
    participant S as SP1-ZKvm
    participant DA as Avail-DA

    %% User 
    U ->>+ L: Stake some collateral into pool
    L -->>- M: Listen event and get tx hash
    
    %% Contract
    M ->> C: Register as a miner (stake token)
    M ->>+ S: use SP1 to generate zk proof (withdraw)
    S ->>+ DA: Submit Compress zkProof to DA
    DA -->>- M: Query Proof data and can let everyone verify
    M ->>+ L: Send Proof and avail hash for verify
    
    %% Withdraw
    U ->> L: After prove collateral can lend money in other pool according collateral

```


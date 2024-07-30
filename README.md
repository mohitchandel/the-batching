# Batching Contract

This project implements a Solidity smart contract for batching Ethereum and ERC20 token transactions, along with a Next.js frontend for interacting with the contract.

### Smart Contract: Batching.sol

The Batching contract allows for efficient batching of multiple Ethereum and ERC20 token transactions in a single operation.

contract Address : [0xE6BFBB88b579ed198ddeC485abaBb8f5a556666F](https://sepolia.etherscan.io/address/0xE6BFBB88b579ed198ddeC485abaBb8f5a556666F)

#### Features

- Batch ETH Transactions: Send ETH to multiple addresses in one transaction.
- Batch ERC20 Token Transactions: Transfer ERC20 tokens to multiple addresses in one transaction.

### Contract Functions

**batchingETHTransactions**

```solidity
batchingETHTransactions(address[] memory persons, uint256[] memory values) external payable
```

- Sends ETH to multiple addresses in a single transaction.
- `persons`: Array of recipient addresses.
- `values`: Array of ETH amounts to send (in wei).
- The total ETH sent must match the sum of values.

**batchTokenTransactions**

```solidity
 batchTokenTransactions(IERC20 _token, address[] memory persons, uint256[] memory amounts) external
```

- Transfers ERC20 tokens to multiple addresses in a single transaction.
- `_token`: Address of the ERC20 token contract.
- `persons`: Array of recipient addresses.
- `amounts`: Array of token amounts to send.
- Requires approval for the contract to spend tokens on behalf of the sender.

### Frontend (Next.js)

The frontend is built using Next.js and allows users to interact with the Batching contract.

#### Setup

1. Clone the repository: `git clone https://github.com/mohitchandel/the-batching.git`

2. Install dependencies: `npm install`

#### Running the App

`npm run dev`

Visit http://localhost:3000 in your browser.

#### Features

- Connect wallet (e.g., MetaMask)
- Input fields for batch ETH transactions
- Input fields for batch ERC20 token transactions

#### Interacting with the Contract

**Batch ETH Transactions:**

- Enter recipient addresses and corresponding ETH amounts.
- Click "Send Transaction" to execute the transaction.

**Batch Token Transactions:**

- Enter the ERC20 token address.
- Enter recipient addresses and corresponding token amounts.
- Click "Send Transaction" to execute the transaction.

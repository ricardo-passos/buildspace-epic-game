# buildspace-epic-game
This is a time-based game. You mint your hero and you have to defeat the big boss.

## Getting started
1 - Head over `blockchain` folder and run these commands:
  - `pnpm run node` and `pnpm run deploy`
  - these you spin up a blockchain node and deploy the smart contract to that node
  - note the logs on the terminal, one of them is the smart contract address
2 - Head over `client` folder and run these commands:
  - `pnpm run dev`
  - get the smart contract address from earlier and create a `.env.development.local` file 

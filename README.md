## Description
Backend script to manage and transfer rewards from a node (or any wallet) on ICON Network.

The following script will run a cron job that will check every hour for unclaimed IScore, and transfer it to the receiver address.

## Requirements

* Install the required packages:
 - make (run `sudo apt-get install make` or `sudo apt-get install build-essential`)
 - docker (follow the instructions [here](https://docs.docker.com/engine/install/))
 - node (follow the instructions [here](https://nodejs.org/en/download))
 - git

* Clone the repository:
 - `git clone https://github.com/icon-project/node-reward-manager.git`

* Define the following environment variables:
```
PRIVATE_KEY='NODE_WALLET_PRIVATE_KEY'
RECEIVER_ADDRESS='cxfa09b71b9a82abc56678707ac4cbc0437635ff1d'
NETWORK='mainnet'
```

## How to run
To start run: `make start`
To Stop run: `make stop`

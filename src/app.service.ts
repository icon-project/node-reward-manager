import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  getIscore,
  validateConfigs,
  getWallet,
  parseFromLoopInHex,
  getIcxBalance,
  claimIscoreTransaction,
  sleep,
  getReceiverAddress,
  sendIcxTransaction,
} from './utils/util';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  @Cron('45 * * * * *')
  async cronJob() {
    try {
      // first validate the configs
      validateConfigs();

      // get wallet instance
      const wallet = getWallet();

      // get the current iScore
      const iscoreResponse = await getIscore(wallet.getAddress());

      // process the iScore data
      const { estimatedICX, iscore } = iscoreResponse.result;
      const parsedEstimatedICX = parseFromLoopInHex(estimatedICX);
      const parsedIscore = parseFromLoopInHex(iscore);

      // get balance of the wallet
      const balanceRequest = await getIcxBalance(wallet.getAddress());
      const parsedBalance = parseFromLoopInHex(balanceRequest.result);

      // Main check logic.
      // If balance is less than 0.002 ICX then log a warning about low balance
      // if the claimable iscore is greater than 0 then
      // Claim the iscore
      // wait for 5 seconds
      // get the new balance
      // If the balance is less than 1 ICX then log a warning about low balance and finish the cron job
      // If the balance is greater than 1 ICX then log a success message
      // Make the transaction to transfer all balance minus
      // 1 ICX to the wallet receiver
      // Log the success message and finish the cron job
      //
      if (parsedBalance < 0.002) {
        this.logger.warn({
          level: 'warn',
          message: `Low balance: ${parsedBalance}`,
        });
      }

      // claim the iscore
      if (parsedIscore > 0) {
        this.logger.log({
          level: 'info',
          message: `Claiming iScore for an estimated ICX: ${parsedEstimatedICX}`,
        });
        const claimResponse = await claimIscoreTransaction(wallet);
        this.logger.log({
          level: 'info',
          message: `Claimed iScore with txHash of: ${claimResponse}`,
        });
      } else {
        this.logger.log({
          level: 'info',
          message: `No claimable iScore: ${parsedIscore}`,
        });
      }

      // wait for 5 seconds and get new balance
      await sleep(5000);

      // get the new balance
      const newBalanceRequest = await getIcxBalance(wallet.getAddress());
      const newParsedBalance = parseFromLoopInHex(newBalanceRequest.result);
      this.logger.log({
        level: 'info',
        message: `New balance: ${newParsedBalance}`,
      });

      if (newParsedBalance < 1) {
        this.logger.warn({
          level: 'warn',
          message: `Low balance: ${newParsedBalance}. Halting the cron job.`,
        });
        return;
      }

      // transfer the balance
      const amountToTransfer = newParsedBalance - 1;
      const receiverAddress = getReceiverAddress();
      this.logger.log({
        level: 'info',
        message: `Transferring balance: ${amountToTransfer}. Receiver: ${receiverAddress}`,
      });

      const txHash = await sendIcxTransaction(
        wallet,
        amountToTransfer,
        receiverAddress,
      );
      this.logger.log({
        level: 'info',
        message: `Transaction successful with txHash: ${txHash}. Finished the cron job.`,
      });
    } catch (err) {
      // log the error
      this.logger.error({
        level: 'error',
        message: `Error in cronJob: ${err.message}`,
        error: err,
      });
    }
  }
}

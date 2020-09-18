import { Account } from "iotex-antenna/lib/account/account";
import { ITokenInfoDict } from "../../erc20/token";
import { IRPCProvider, WalletAction, WalletActionType } from "./wallet-reducer";

export const setNetwork = (
  network: IRPCProvider,
  defaultNetworkTokens: Array<string> = []
): WalletAction => {
  return {
    type: WalletActionType.SET_NETWORK,
    payload: {
      network,
      defaultNetworkTokens
    }
  };
};

export const addCustomRPC = (network: IRPCProvider): WalletAction => ({
  type: WalletActionType.ADD_CUSTOM_RPC,
  payload: {
    customRPC: network
  }
});

export const setAccount = (
  account?: Account,
  hideExport?: boolean
): WalletAction => ({
  type: WalletActionType.SET_ACCOUNT,
  payload: {
    account,
    hideExport
  }
});

export const setTokens = (tokens: ITokenInfoDict): WalletAction => ({
  type: WalletActionType.UPDATE_TOKENS,
  payload: {
    tokens
  }
});

/**
 * Default after 2 hours;
 */
export const countdownToLockInMS = (
  after = 2 * 60 * 60 * 1000
): WalletAction => {
  const lockAt = after === 0 ? 0 : Date.now() + after;

  return {
    type: WalletActionType.SET_LOCK_TIME,
    payload: {
      lockAt
    }
  };
};

export const delayLock = (isLockDelayed: boolean): WalletAction => ({
  type: WalletActionType.DELAY_LOCK,
  payload: {
    isLockDelayed
  }
});

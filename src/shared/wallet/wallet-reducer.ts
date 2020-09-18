import { Account } from "iotex-antenna/lib/account/account";
import { ITokenInfoDict } from "../../erc20/token";

export type QueryType = "CONTRACT_INTERACT";
export enum WsConnectType {
  SIGN_AND_SEND = "SIGN_AND_SEND",
  GET_ACCOUNT = "GET_ACCOUNTS",
  SIGN_MESSAGE = "SIGN_MSG",
  CLEAR_SIGN_MESSAGE = "CLEAR_SIGN_MSG"
}

export enum WalletActionType {
  SET_ACCOUNT = "SET_ACCOUNT",
  SET_NETWORK = "SET_NETWORK",
  ADD_CUSTOM_RPC = "ADD_CUSTOM_RPC",
  UPDATE_TOKENS = "UPDATE_TOKENS",
  SET_LOCK_TIME = "SET_LOCK_TIME",
  SET_ORIGIN = "SET_ORIGIN",
  DELAY_LOCK = "DELAY_LOCK"
}
export type QueryParams = {
  amount?: number;
  gasPrice?: string;
  gasLimit?: number;
  abi?: string;
  type?: QueryType;
  queryNonce?: number;
  contractAddress?: string;
  method?: string;
  args?: string; // JSON of Array<any>
};

type QueryParamAction = {
  type: "QUERY_PARAMS";
  payload: QueryParams;
};

export type SignParams = {
  reqId?: number;
  type?: WsConnectType;
  msg?: string;
  content?: string; // message
  envelop?: string;
  method?: string | Array<string>;
  origin?: string;
};

export type SignParamAction = {
  type: "SIGN_PARAMS";
  payload: SignParams;
};

export const queryParamsReducer = (
  state: {} = {},
  action: QueryParamAction
) => {
  if (action.type === "QUERY_PARAMS") {
    return {
      ...state,
      ...action.payload
    };
  }
  return state || {};
};

export const signParamsReducer = (state: {} = {}, action: SignParamAction) => {
  if (action.type === "SIGN_PARAMS") {
    return {
      ...state,
      ...action.payload
    };
  }
  if (action.type === WsConnectType.CLEAR_SIGN_MESSAGE) {
    return {
      ...state,
      type: "",
      msg: ""
    };
  }
  return state || {};
};

export interface IRPCProvider {
  name: string;
  url: string;
}

export type WalletAction = {
  type: WalletActionType;
  payload: {
    account?: Account;
    hideExport?: boolean;
    network?: IRPCProvider;
    customRPC?: IRPCProvider;
    tokens?: ITokenInfoDict;
    defaultNetworkTokens?: Array<string>;
    lockAt?: number;
    isLockDelayed?: boolean;
  };
};

export interface IWalletState {
  account?: Account;
  hideExport?: boolean;
  network?: IRPCProvider;
  customRPCs: Array<IRPCProvider>;
  tokens: ITokenInfoDict;
  defaultNetworkTokens: Array<string>;
  lockAt?: number; // milliseconds to lock wallet. 0: never lock. 1: never to reset it;
  isLockDelayed?: boolean;
  showUnlockModal?: boolean;
}

export const walletReducer = (
  state: IWalletState = {
    customRPCs: [],
    defaultNetworkTokens: [],
    tokens: {},
    lockAt: 0,
    isLockDelayed: false
  },
  action: WalletAction
) => {
  switch (action.type) {
    case WalletActionType.SET_ACCOUNT:
      const { account, hideExport } = action.payload;
      return { ...state, account, hideExport };
    case WalletActionType.ADD_CUSTOM_RPC:
      const { customRPC } = action.payload;
      if (!customRPC) {
        return state;
      }
      const rpc = state.customRPCs.find(rpc => rpc.url === customRPC.url);
      if (rpc) {
        rpc.name = customRPC.name;
        return { ...state };
      }
      return {
        ...state,
        customRPCs: [...state.customRPCs, customRPC]
      };
    case WalletActionType.SET_NETWORK:
      return {
        ...state,
        network: action.payload.network,
        defaultNetworkTokens: action.payload.defaultNetworkTokens
      };
    case WalletActionType.UPDATE_TOKENS:
      return {
        ...state,
        tokens: action.payload.tokens
      };
    case WalletActionType.SET_LOCK_TIME:
      return {
        ...state,
        lockAt: action.payload.lockAt
      };
    case WalletActionType.DELAY_LOCK:
      return {
        ...state,
        isLockDelayed: action.payload.isLockDelayed
      };
    default:
      return state;
  }
};

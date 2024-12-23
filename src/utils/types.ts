export type QueryIscore = {
  address: string;
};

export type JsonRpcInnerParams = QueryIscore | null;

export type JsonRpcOuterParams = {
  to: string;
  dataType: string;
  data: {
    method: string;
    params: JsonRpcInnerParams;
  };
};

export type IcxGetBalanceParams = QueryIscore;

export type JsonRpcRequest = {
  jsonrpc: string;
  method: string;
  params: JsonRpcOuterParams | IcxGetBalanceParams;
  id: number;
};

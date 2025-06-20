import {
  forestChainToViemChain,
  httpTransport,
  Indexer,
} from "@forest-protocols/sdk";
import { createPublicClient } from "viem";
import { abortController } from "./signal";
import { config } from "./config";

export const rpcClient = createPublicClient({
  chain: forestChainToViemChain(config.CHAIN),
  transport: httpTransport(
    config.CHAIN,
    config.RPC_HOST,
    abortController.signal
  ),
});

export const indexerClient = new Indexer({
  baseURL: config.INDEXER_ENDPOINT,
});

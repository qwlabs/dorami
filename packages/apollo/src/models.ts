import type { FetchResult, Observable } from '@apollo/client';
import type { DefaultOptions } from '@apollo/client/core/ApolloClient';
import type { NetworkError } from '@apollo/client/errors';
import type { GraphQLFormattedError } from 'graphql/error/GraphQLError';

export type RequestHeaderAugmentor = (headers: Record<string, any>) => Record<string, any>;

export interface ErrorMatchHandler {
  match: (error: Error) => boolean;

  handle: (error: Error) => Observable<FetchResult> | void;
}

export interface NetworkErrorMatchHandler extends ErrorMatchHandler {
  match: (error: NetworkError) => boolean;

  handle: (error: NetworkError) => Observable<FetchResult> | void;
}

export interface GraphQLErrorMatchHandler extends ErrorMatchHandler {
  match: (error: GraphQLFormattedError) => boolean;

  handle: (error: GraphQLFormattedError) => Observable<FetchResult> | void;
}

export interface GraphqlApiClientConfig {
  ssrMode: boolean;
  connectToDevTools: boolean;
  url: string;
  subscriptionUrl?: string;
  batchEnabled: boolean;
  headerAugmentor?: RequestHeaderAugmentor;
  networkErrorHandlers: NetworkErrorMatchHandler[];
  graphQLErrorHandlers: GraphQLErrorMatchHandler[];
  defaultOptions?: DefaultOptions;
}

export const DEFAULT_OPTIONS: DefaultOptions = {
  query: {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  },
  mutate: {
    fetchPolicy: 'no-cache',
    keepRootFields: true,
  },
  watchQuery: {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache',
    returnPartialData: true,
  },
};

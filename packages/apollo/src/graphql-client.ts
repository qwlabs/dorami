import type { ApolloCache, NormalizedCacheObject, Operation } from '@apollo/client/core';
import type { GraphqlApiClientConfig } from './models';
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, split } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { DEFAULT_OPTIONS } from './models';

const loadHeaders = (config: GraphqlApiClientConfig): Record<string, any> => {
  let headers: Record<string, any> = {};
  headers['Content-Type'] = 'application/json;charset=UTF-8';
  headers['Accept-Language'] = 'zh-CN';
  if (config.headerAugmentor) {
    headers = config.headerAugmentor(headers);
  }
  return headers;
};

const createAHttpLink = (config: GraphqlApiClientConfig): ApolloLink => {
  const normalHttpLink = createHttpLink({
    uri: (params: Operation) => {
      return `${config.url}?op=${params.operationName}`;
    },
  });
  const batchHttpLink = createHttpLink({
    uri: config.url,
  });
  return split(() => config.batchEnabled, batchHttpLink, normalHttpLink);
};

const createWSLink = (config: GraphqlApiClientConfig): ApolloLink => {
  return ApolloLink.from([]);
};

const createGraphqlLink = (config: GraphqlApiClientConfig): ApolloLink => {
  const httpLink = createAHttpLink(config);
  const wsLink = createWSLink(config);
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );
};

const createErrorLink = (config: GraphqlApiClientConfig): ApolloLink => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors != null && graphQLErrors.length > 0) {
      graphQLErrors.forEach((graphQLError) => {
        const handler = config.graphQLErrorHandlers.find((handler) => handler.match(graphQLError));
        handler?.handle(graphQLError);
      });
    }
    if (networkError) {
      const handler = config.networkErrorHandlers.find((handler) => handler.match(networkError));
      handler?.handle(networkError);
    }
  });
};

const createMiddleware = (config: GraphqlApiClientConfig): ApolloLink => {
  return new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: loadHeaders(config),
    });
    return forward(operation);
  });
};

const createLink = (config: GraphqlApiClientConfig): ApolloLink => {
  const middleware = createMiddleware(config);
  const graphqlLink = createGraphqlLink(config);
  const errorLink = createErrorLink(config);
  return ApolloLink.from([errorLink, middleware, graphqlLink]);
};

export const createClient = (config: GraphqlApiClientConfig): { client: ApolloClient<any>; cache: ApolloCache<NormalizedCacheObject> } => {
  const link = createLink(config);
  const cache = new InMemoryCache({
    resultCaching: true,
  });
  const client = new ApolloClient({
    link,
    cache,
    ssrMode: config.ssrMode,
    queryDeduplication: true,
    defaultOptions: config.defaultOptions ?? DEFAULT_OPTIONS,
    devtools: {
      enabled: config.connectToDevTools,
    }
  });
  return { client, cache };
};

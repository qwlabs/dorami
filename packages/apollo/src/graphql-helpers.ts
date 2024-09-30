export interface RelyEdge<N> {
  node: N;
}

export interface RelyConnection<N> {
  edges: RelyEdge<N>[];
}

export const extractRelyData = <N, R>(connection: unknown, mapping?: (node: N) => R): R[] => {
  return ((connection as RelyConnection<N>)?.edges ?? []).map((edge: RelyEdge<N>) => {
    return mapping ? mapping(edge.node) : (edge.node as unknown as R);
  });
};

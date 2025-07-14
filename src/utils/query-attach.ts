export interface QueryParams {}

export interface QueryBuilder<Q extends Partial<QueryParams> = {}> {
  readonly query: Q;
}

export type ReturnedQueryBuilder<
  Q extends Partial<QueryParams>,
  Prop extends keyof Partial<QueryParams>,
  Exclude extends keyof QueryBuilder
> = Omit<QueryBuilder<Q & Pick<QueryParams, Prop>>, Exclude>;

function createBuilder<Q extends Partial<QueryParams>>(
  query: Q
): QueryBuilder<Q> {
  return {
    query,
  };
}

export const queryAttach = createBuilder({});

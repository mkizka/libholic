import { env } from "~/utils/env";

type GraphqlResponseNode = {
  object: {
    text: string;
  } | null;
};

export type RateLimit = {
  limit: number;
  cost: number;
  remaining: number;
  resetAt: string;
};

type GraphqlResponse = {
  rateLimit: RateLimit;
  user: {
    repositories: {
      nodes: GraphqlResponseNode[];
    };
  };
};

function graphql(query: string, variables: object) {
  return JSON.stringify({ query, variables });
}

type RequestGraphqlOptions = {
  login: string;
  filename: string;
};

export async function requestGraphql({
  login,
  filename,
}: RequestGraphqlOptions) {
  const response = await fetch("https://api.github.com/graphql", {
    body: graphql(
      `
        query ($login: String!, $expression: String) {
          rateLimit {
            limit
            cost
            remaining
            resetAt
          }
          user(login: $login) {
            repositories(last: 20, isFork: false) {
              nodes {
                object(expression: $expression) {
                  ... on Blob {
                    text
                  }
                }
              }
            }
          }
        }
      `,
      {
        login,
        expression: `HEAD:${filename}`,
      }
    ),
    method: "POST",
    headers: {
      "User-Agent": "mkizka",
      authorization: `token ${env.GITHUB_TOKEN}`,
    },
  });
  const { rateLimit, user } = (await response.json()).data as GraphqlResponse;
  const texts = user.repositories.nodes.map((node) =>
    node.object != null ? node.object.text : null
  );
  return { rateLimit, texts };
}

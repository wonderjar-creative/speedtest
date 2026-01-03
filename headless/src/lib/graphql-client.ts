import { GraphQLClient } from "graphql-request";

const endpoint =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ||
  "https://slow.speedtest.denverheadless.com/graphql";

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

export const revalidateTime = parseInt(
  process.env.REVALIDATE_TIME || "60",
  10
);

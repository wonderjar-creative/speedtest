import gql from "graphql-tag";

export const PostsQuery = gql`
  query Posts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        databaseId
        title
        excerpt
        date
        uri
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            id
            name
            uri
          }
        }
        tags {
          nodes {
            id
            name
            uri
          }
        }
      }
    }
  }
`;

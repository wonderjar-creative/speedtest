import gql from "graphql-tag";

export const TeamMembersQuery = gql`
  query TeamMembers($first: Int, $after: String) {
    teamMembers(first: $first, after: $after) {
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
        uri
        position
        bio
        photoUrl
        order
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
      }
    }
  }
`;

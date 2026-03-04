import gql from "graphql-tag";

export const ProjectsQuery = gql`
  query Projects($first: Int, $after: String) {
    projects(first: $first, after: $after) {
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
        uri
        location
        projectType
        squareFootage
        yearCompleted
        photoUrl
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

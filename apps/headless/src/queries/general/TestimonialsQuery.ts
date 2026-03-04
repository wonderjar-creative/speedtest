import gql from "graphql-tag";

export const TestimonialsQuery = gql`
  query Testimonials($first: Int, $after: String) {
    testimonials(first: $first, after: $after) {
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
        content
        uri
        authorName
        authorRole
        rating
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

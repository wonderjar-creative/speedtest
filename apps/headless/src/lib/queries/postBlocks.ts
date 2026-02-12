/**
 * GraphQL query to fetch a post with its block data for rendering.
 */
export const POST_BLOCKS_QUERY = `
  query PostBlocksQuery($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      databaseId
      title
      blocksData
      templateSlug
      date
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
          slug
          uri
        }
      }
      tags {
        nodes {
          id
          name
          slug
          uri
        }
      }
    }
  }
`;

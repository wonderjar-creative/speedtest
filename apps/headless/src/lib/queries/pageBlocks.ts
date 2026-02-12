/**
 * GraphQL query to fetch a page with its block data for rendering.
 */
export const PAGE_BLOCKS_QUERY = `
  query PageBlocksQuery($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      databaseId
      title
      blocksData
      templateSlug
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
`;

/**
 * GraphQL query to determine content type and basic metadata.
 * Used by the catch-all route to decide which template to use.
 */
export const CONTENT_INFO_QUERY = `
  query ContentInfoQuery($slug: String!, $idType: ContentNodeIdTypeEnum!) {
    contentNode(id: $slug, idType: $idType) {
      databaseId
      ... on ContentNode {
        contentTypeName
        status
        uri
      }
      ... on Page {
        isPostsPage
        isFrontPage
      }
    }
  }
`;

export const POSTS_PAGE_QUERY = `
  query PostsPageQuery {
    pages(where: { status: PUBLISH }, first: 100) {
      nodes {
        databaseId
        title
        slug
        status
        isPostsPage
      }
    }
  }
`;

import gql from "graphql-tag";

export const PostsPageQuery = gql`
  query PostsPage {
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

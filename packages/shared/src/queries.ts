// GraphQL query fragments and definitions shared between apps
// These can be imported and used with graphql-request or Apollo

export const POST_FIELDS = `
  id
  databaseId
  title
  slug
  content
  excerpt
  date
  featuredImage {
    node {
      id
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;

export const PAGE_FIELDS = `
  id
  databaseId
  title
  slug
  content
  template {
    templateName
  }
  featuredImage {
    node {
      id
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;

export const MENU_ITEM_FIELDS = `
  id
  label
  url
  path
  parentId
`;

// Example queries - adjust based on your WPGraphQL schema
export const GET_POSTS = `
  query GetPosts($first: Int = 10) {
    posts(first: $first) {
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ${POST_FIELDS}
    }
  }
`;

export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      ${PAGE_FIELDS}
    }
  }
`;

export const GET_MENU = `
  query GetMenu($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }) {
      nodes {
        ${MENU_ITEM_FIELDS}
      }
    }
  }
`;

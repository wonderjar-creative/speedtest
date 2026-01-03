import { gql } from "graphql-request";

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projects(first: 20) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
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

export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      slug
      content
      excerpt
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

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
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

export const GET_ALL_PAGES = gql`
  query GetAllPages {
    pages(first: 20) {
      nodes {
        id
        databaseId
        title
        slug
        uri
      }
    }
  }
`;

export const GET_MENU = gql`
  query GetMenu($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }) {
      nodes {
        id
        label
        uri
        path
      }
    }
  }
`;

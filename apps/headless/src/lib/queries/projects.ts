export const ALL_PROJECTS_QUERY = `
  query GetAllProjects {
    projects(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
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
        projectFields {
          location
          squareFootage
          yearCompleted
          photoUrl
        }
        projectTypes {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const PROJECT_BY_SLUG_QUERY = `
  query GetProject($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      id
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
      projectFields {
        location
        squareFootage
        yearCompleted
        photoUrl
      }
      projectTypes {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export const PROJECT_SLUGS_QUERY = `
  query GetProjectSlugs {
    projects(first: 50) {
      nodes {
        slug
      }
    }
  }
`;

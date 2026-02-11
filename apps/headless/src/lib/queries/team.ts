export const ALL_TEAM_MEMBERS_QUERY = `
  query GetAllTeamMembers {
    teamMembers(first: 20) {
      nodes {
        id
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
        teamMemberFields {
          position
          bio
          photoUrl
          order
        }
      }
    }
  }
`;

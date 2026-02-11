export const ALL_TESTIMONIALS_QUERY = `
  query GetAllTestimonials {
    testimonials(first: 20) {
      nodes {
        id
        title
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
        testimonialFields {
          authorName
          authorRole
          rating
          photoUrl
        }
      }
    }
  }
`;

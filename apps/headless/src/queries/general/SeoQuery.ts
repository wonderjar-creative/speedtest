import gql from "graphql-tag";

export const SeoQuery = gql`
  query SeoQuery(
    $slug: ID!
    $idType: ContentNodeIdTypeEnum
    $preview: Boolean = false
  ) {
    contentNode(id: $slug, idType: $idType, asPreview: $preview) {
      seo {
        title
        description
        canonicalUrl
        focusKeywords
        robots
        isPillarContent
        fullHead
        breadcrumbTitle
        openGraph {
          title
          description
          url
          siteName
          type
          locale
          image {
            url
            width
            height
          }
          articleMeta {
            section
            publishedTime
            modifiedTime
          }
          twitterMeta {
            card
            title
            description
            image
          }
        }
        jsonLd {
          raw
        }
      }
    }
  }
`;

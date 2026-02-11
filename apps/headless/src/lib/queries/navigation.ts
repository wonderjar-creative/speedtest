export const MENU_QUERY = `
  query GetMenu($id: ID!) {
    menu(id: $id, idType: SLUG) {
      menuItems(first: 50) {
        nodes {
          id
          label
          uri
          parentId
          childItems {
            nodes {
              id
              label
              uri
            }
          }
        }
      }
    }
  }
`;

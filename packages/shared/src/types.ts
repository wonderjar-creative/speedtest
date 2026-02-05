// WordPress/GraphQL types shared between apps
// These will be populated as you build out the GraphQL schema

export interface WPPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  date: string;
  featuredImage?: {
    node: WPMediaItem;
  };
}

export interface WPPage {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content?: string;
  template?: {
    templateName: string;
  };
  featuredImage?: {
    node: WPMediaItem;
  };
}

export interface WPMediaItem {
  id: string;
  sourceUrl: string;
  altText?: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
}

export interface WPMenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId?: string;
  children?: WPMenuItem[];
}

export interface WPTestimonial {
  id: string;
  title: string;
  content: string;
  testimonialFields?: {
    authorName: string;
    authorTitle?: string;
    authorCompany?: string;
  };
}

export interface WPService {
  id: string;
  title: string;
  content: string;
  slug: string;
  serviceFields?: {
    shortDescription?: string;
    icon?: string;
  };
}

export interface WPTeamMember {
  id: string;
  title: string;
  content: string;
  teamMemberFields?: {
    role?: string;
    email?: string;
    linkedinUrl?: string;
  };
  featuredImage?: {
    node: WPMediaItem;
  };
}

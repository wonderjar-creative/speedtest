export interface MenuItem {
  id: string;
  label: string;
  uri: string;
  childItems?: {
    nodes: MenuItem[];
  };
}

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
    mediaDetails?: {
      width: number;
      height: number;
    };
  };
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: FeaturedImage | null;
  projectFields: {
    location: string;
    squareFootage: string;
    yearCompleted: string;
    photoUrl: string;
  };
  projectTypes: {
    nodes: { name: string; slug: string }[];
  };
}

export interface TeamMember {
  id: string;
  title: string;
  slug: string;
  content: string;
  teamMemberFields: {
    position: string;
    bio: string;
    photoUrl: string;
    order: number;
  };
  featuredImage: FeaturedImage | null;
}

export interface Testimonial {
  id: string;
  title: string;
  content: string;
  testimonialFields: {
    authorName: string;
    authorRole: string;
    rating: number;
    photoUrl: string;
  };
  featuredImage: FeaturedImage | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featuredImage: FeaturedImage | null;
  categories?: {
    nodes: { name: string; slug: string }[];
  };
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: FeaturedImage | null;
}

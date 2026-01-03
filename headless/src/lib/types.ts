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
  databaseId: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: FeaturedImage;
}

export interface Page {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  uri: string;
  content?: string;
  featuredImage?: FeaturedImage;
}

export interface MenuItem {
  id: string;
  label: string;
  uri: string;
  path: string;
}

export interface ProjectsResponse {
  projects: {
    nodes: Project[];
  };
}

export interface ProjectResponse {
  project: Project;
}

export interface PagesResponse {
  pages: {
    nodes: Page[];
  };
}

export interface PageResponse {
  page: Page;
}

export interface MenuResponse {
  menuItems: {
    nodes: MenuItem[];
  };
}

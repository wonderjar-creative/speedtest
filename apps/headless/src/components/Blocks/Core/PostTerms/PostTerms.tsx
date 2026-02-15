import Link from "next/link";
import { getBlockClasses } from "@/utils/blockStyles";
import { ContentNodeWithBlocks } from "@/types/coreBlockTypes";

interface PostTermsAttributes {
  term?: string;
  separator?: string;
  className?: string;
  textAlign?: string;
  fontSize?: string;
  textColor?: string;
  backgroundColor?: string;
  style?: Record<string, unknown>;
}

interface Term {
  name: string;
  slug: string;
  uri?: string;
}

interface PostTermsProps {
  name: string;
  attributes: PostTermsAttributes;
  page: ContentNodeWithBlocks;
}

const PostTerms: React.FC<PostTermsProps> = ({ attributes, page }) => {
  const { term = "post_tag", separator = ", ", className } = attributes;

  const post = page as unknown as {
    tags?: { nodes: Term[] };
    categories?: { nodes: Term[] };
  };

  let terms: Term[] = [];

  if (term === "post_tag" && post.tags?.nodes) {
    terms = post.tags.nodes;
  } else if (term === "category" && post.categories?.nodes) {
    terms = post.categories.nodes;
  }

  if (terms.length === 0) {
    return null;
  }

  const blockClasses = getBlockClasses(attributes, "wp-block-post-terms");
  const combinedClasses = className ? `${blockClasses} ${className}` : blockClasses;

  return (
    <div className={combinedClasses}>
      {terms.map((termItem, index) => (
        <span key={termItem.slug}>
          <Link
            href={termItem.uri || `/${term === "post_tag" ? "tag" : "category"}/${termItem.slug}`}
            className="hover:underline"
          >
            {termItem.name}
          </Link>
          {index < terms.length - 1 && <span>{separator}</span>}
        </span>
      ))}
    </div>
  );
};

export default PostTerms;

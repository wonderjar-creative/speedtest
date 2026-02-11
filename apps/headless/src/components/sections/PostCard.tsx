import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const imageUrl = post.featuredImage?.node.sourceUrl;
  const altText = post.featuredImage?.node.altText || post.title;
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/blog/${post.slug}`} className="block no-underline">
        <div className="relative aspect-[16/9]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <h3 className="text-xl font-bold mb-3">
          <Link
            href={`/blog/${post.slug}`}
            className="text-gray-900 no-underline hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        <div
          className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary font-semibold text-sm hover:text-accent transition-colors"
        >
          Read More &rarr;
        </Link>
      </div>
    </article>
  );
}

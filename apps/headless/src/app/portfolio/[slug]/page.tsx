import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { PROJECT_BY_SLUG_QUERY, PROJECT_SLUGS_QUERY } from "@/lib/queries/projects";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { Project } from "@/lib/types";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const data = await fetchGraphQL<{ projects: { nodes: { slug: string }[] } }>(PROJECT_SLUGS_QUERY);
    return (data?.projects?.nodes ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const data = await fetchGraphQL<{ project: Project | null }>(PROJECT_BY_SLUG_QUERY, { slug });
    if (!data?.project) return {};
    return {
      title: data.project.title,
      description: data.project.excerpt?.replace(/<[^>]*>/g, "").slice(0, 160) || `${data.project.title} — Elevation Design Studio`,
    };
  } catch {
    return {};
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchGraphQL<{ project: Project | null }>(PROJECT_BY_SLUG_QUERY, { slug });
  const project = data?.project;

  if (!project) notFound();

  const imageUrl = project.featuredImage?.node?.sourceUrl || project.projectFields?.photoUrl;
  const fields = project.projectFields;
  const types = project.projectTypes?.nodes ?? [];

  return (
    <>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={project.featuredImage?.node?.altText || project.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1400px] mx-auto px-6 pb-12 w-full">
            <h1 className="text-4xl md:text-5xl text-white mb-4">{project.title}</h1>
            {types.length > 0 && (
              <div className="flex gap-2">
                {types.map((t) => (
                  <span key={t.slug} className="px-3 py-1 bg-primary/80 text-white text-sm rounded-full">
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SectionWrapper>
        {/* Project details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>

          <aside className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
              {fields?.location && (
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{fields.location}</p>
                </div>
              )}
              {fields?.squareFootage && (
                <div>
                  <p className="text-sm text-gray-500">Square Footage</p>
                  <p className="font-medium">{fields.squareFootage} sq ft</p>
                </div>
              )}
              {fields?.yearCompleted && (
                <div>
                  <p className="text-sm text-gray-500">Year Completed</p>
                  <p className="font-medium">{fields.yearCompleted}</p>
                </div>
              )}
              {types.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{types.map((t) => t.name).join(", ")}</p>
                </div>
              )}
            </div>

            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-primary hover:text-accent no-underline font-medium"
            >
              &larr; Back to Portfolio
            </Link>
          </aside>
        </div>
      </SectionWrapper>
    </>
  );
}

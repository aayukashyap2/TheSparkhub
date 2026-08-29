import { PublicSectionPage, pageTiles } from "@/components/site/public-section-page";

export const metadata = {
  title: "Ideas | SparkHub",
  description:
    "A dedicated SparkHub path for idea posters to publish, refine, and track engagement.",
};

export default function IdeasPage() {
  return (
    <PublicSectionPage
      description="Idea posters need more than a form. SparkHub gives creators a path for publishing, engagement, investor visibility, collaboration, and mentorship."
      eyebrow="For idea posters"
      primaryHref="/signup"
      primaryLabel="Post an idea"
      tiles={pageTiles.ideas}
      title="Build a stronger home for your idea."
    />
  );
}

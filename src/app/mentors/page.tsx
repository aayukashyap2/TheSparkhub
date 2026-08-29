import { PublicSectionPage, pageTiles } from "@/components/site/public-section-page";

export const metadata = {
  title: "Mentors | SparkHub",
  description:
    "A SparkHub mentor experience for matching expertise with idea posters and collaboration needs.",
};

export default function MentorsPage() {
  return (
    <PublicSectionPage
      description="Mentors help ideas mature. SparkHub keeps that support visible and valuable while keeping mentorship, investor interest, and investments as separate product concepts."
      eyebrow="For mentors"
      primaryHref="/signup"
      primaryLabel="Join as mentor"
      tiles={pageTiles.mentors}
      title="Guide founders before the big moments."
    />
  );
}

import { PublicSectionPage, pageTiles } from "@/components/site/public-section-page";

export const metadata = {
  title: "Explore Ideas | SparkHub",
  description:
    "Discover public ideas on SparkHub while keeping watchlists, interests, connections, and investments distinct.",
};

export default function ExplorePage() {
  return (
    <PublicSectionPage
      description="Explore is the public discovery layer for SparkHub. It is built to surface promising ideas without confusing attention, interest, connection, and investment."
      eyebrow="Public discovery"
      primaryHref="/signup"
      primaryLabel="Create your profile"
      tiles={pageTiles.explore}
      title="Find ideas worth a serious second look."
    />
  );
}

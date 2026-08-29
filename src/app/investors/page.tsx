import { PublicSectionPage, pageTiles } from "@/components/site/public-section-page";

export const metadata = {
  title: "Investors | SparkHub",
  description:
    "A SparkHub investor experience for discovery, watchlists, investment interests, connections, and portfolio records.",
};

export default function InvestorsPage() {
  return (
    <PublicSectionPage
      description="Investors get a distinct workflow for discovery, watchlists, investment interests, connections, and portfolio records. Expressing interest starts a workflow; it does not create an investment."
      eyebrow="For investors"
      primaryHref="/signup"
      primaryLabel="Join as investor"
      tiles={pageTiles.investors}
      title="Signal interest without pretending the deal is done."
    />
  );
}

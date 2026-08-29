import { redirect } from "next/navigation";
import { requireOnboardedUser } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function AppIndexPage() {
  const { primaryRole } = await requireOnboardedUser();

  redirect(ROLE_HOME[primaryRole]);
}

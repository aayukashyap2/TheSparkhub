import Link from "next/link";
import { Check, Handshake, X } from "lucide-react";
import { respondToConnectionAction } from "@/app/actions/ideas";
import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { requireRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/ideas/format";
import { listProfileConnections } from "@/lib/ideas/queries";
import type { RequestStatus } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

const statusLabels: Record<RequestStatus, string> = {
  accepted: "Accepted",
  blocked: "Blocked",
  cancelled: "Cancelled",
  declined: "Declined",
  pending: "Pending",
};

export default async function IdeaPosterCollaborationsPage() {
  const { user, profile } = await requireRole("idea_poster");
  const connections = await listProfileConnections(user.id);

  return (
    <AppShell
      active="Collaborations"
      displayName={profile.display_name}
      role="idea_poster"
    >
      <AppPageHeader
        description="Connection requests live here after an investor interest becomes a mutual conversation."
        eyebrow="Collaborations"
        title="Build with people before deals."
      />
      <div className="mt-8">
        {connections.length === 0 ? (
          <EmptyWorkflow
            href="/app/idea-poster/investors"
            linkLabel="Review investors"
            text="When you or an investor request a connection from an interest record, the collaboration state appears here."
            title="No collaborations yet"
          />
        ) : (
          <div className="grid gap-3">
            {connections.map((connection) => (
              <article
                className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5 shadow-sm"
                key={connection.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#1f7a5a]">
                      {statusLabels[connection.status]}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[#101817]">
                      {connection.otherName}
                    </h2>
                    <p className="mt-2 text-sm text-[#60716b]">
                      {connection.ideaSlug ? (
                        <Link
                          className="font-medium text-[#3157a4] hover:text-[#1f7a5a]"
                          href={`/ideas/${connection.ideaSlug}`}
                        >
                          {connection.ideaTitle}
                        </Link>
                      ) : (
                        connection.ideaTitle ?? "General connection"
                      )}{" "}
                      - Requested {formatDate(connection.created_at)}
                    </p>
                  </div>
                  <Handshake
                    aria-hidden="true"
                    className="text-[#d4912a]"
                    size={23}
                  />
                </div>
                {connection.message ? (
                  <p className="mt-4 rounded-lg bg-white p-3 text-sm leading-6 text-[#40554f]">
                    {connection.message}
                  </p>
                ) : null}
                {connection.status === "pending" &&
                connection.addressee_id === user.id ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <ConnectionResponseForm
                      connectionId={connection.id}
                      response="accepted"
                    />
                    <ConnectionResponseForm
                      connectionId={connection.id}
                      response="declined"
                    />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ConnectionResponseForm({
  connectionId,
  response,
}: {
  connectionId: string;
  response: "accepted" | "declined";
}) {
  const isAccepted = response === "accepted";

  return (
    <form action={respondToConnectionAction}>
      <input name="connectionId" type="hidden" value={connectionId} />
      <input
        name="returnTo"
        type="hidden"
        value="/app/idea-poster/collaborations"
      />
      <input name="response" type="hidden" value={response} />
      <button
        className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
          isAccepted
            ? "bg-[#1f7a5a] text-white hover:bg-[#176348]"
            : "border border-[#ccd6d1] bg-white text-[#263b35] hover:border-[#8faf9f]"
        }`}
      >
        {isAccepted ? (
          <Check aria-hidden="true" size={16} />
        ) : (
          <X aria-hidden="true" size={16} />
        )}
        {isAccepted ? "Accept" : "Decline"}
      </button>
    </form>
  );
}

import Link from "next/link";
import { Check, Clock, MessageCircle, X } from "lucide-react";
import {
  requestConnectionForInterestAction,
  respondToConnectionAction,
} from "@/app/actions/ideas";
import { SubmitButton } from "@/components/auth/submit-button";
import { formatDate } from "@/lib/ideas/format";
import type {
  InvestmentInterestStatus,
  RequestStatus,
} from "@/lib/supabase/database.types";
import type { InvestmentInterestWithContext } from "@/lib/ideas/queries";

const interestStatusLabels: Record<InvestmentInterestStatus, string> = {
  contacted: "Contacted",
  converted: "Converted",
  discussion: "In discussion",
  interested: "Interested",
  passed: "Passed",
};

const connectionStatusLabels: Record<RequestStatus, string> = {
  accepted: "Accepted",
  blocked: "Blocked",
  cancelled: "Cancelled",
  declined: "Declined",
  pending: "Pending",
};

type InvestmentInterestCardProps = {
  interest: InvestmentInterestWithContext;
  mode: "creator" | "investor";
  returnTo: string;
  viewerId: string;
};

export function InvestmentInterestCard({
  interest,
  mode,
  returnTo,
  viewerId,
}: InvestmentInterestCardProps) {
  const counterpart =
    mode === "investor" ? interest.creatorName : interest.investorName;
  const counterpartLabel = mode === "investor" ? "Creator" : "Investor";
  const canRespond =
    interest.connectionStatus === "pending" &&
    interest.connectionAddresseeId === viewerId;
  const canRequest = !interest.connectionId;

  return (
    <article className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[#1f7a5a]">
            {interestStatusLabels[interest.status]}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#101817]">
            {interest.ideaSlug ? (
              <Link className="hover:text-[#1f7a5a]" href={`/ideas/${interest.ideaSlug}`}>
                {interest.ideaTitle}
              </Link>
            ) : (
              interest.ideaTitle
            )}
          </h2>
          <p className="mt-2 text-sm text-[#60716b]">
            {counterpartLabel}: {counterpart} - Level: {interest.level}
          </p>
        </div>
        <div className="rounded-full border border-[#d8e2de] bg-white px-3 py-1 text-xs font-semibold text-[#40554f]">
          {interest.connectionStatus
            ? `Connection: ${connectionStatusLabels[interest.connectionStatus]}`
            : "No connection yet"}
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm leading-6 text-[#60716b] md:grid-cols-2">
        <Detail label="Message" value={interest.message} />
        <Detail label="Possible range" value={interest.proposed_range} />
        <Detail label="Questions" value={interest.questions} />
        <Detail label="Created" value={formatDate(interest.created_at)} />
      </div>

      <div className="mt-5 border-t border-[#e5ebe7] pt-5">
        {canRequest ? (
          <form action={requestConnectionForInterestAction} className="grid gap-3">
            <input name="interestId" type="hidden" value={interest.id} />
            <input name="returnTo" type="hidden" value={returnTo} />
            <label className="text-sm font-semibold text-[#263b35]">
              Connection note
              <textarea
                className="mt-2 min-h-20 w-full resize-y rounded-lg border border-[#ccd6d1] bg-white px-3 py-2 text-sm text-[#172521] outline-none transition focus:border-[#1f7a5a]"
                name="message"
                placeholder="Add a short reason for connecting."
              />
            </label>
            <SubmitButton>
              <span className="inline-flex items-center gap-2">
                Request connection
                <MessageCircle aria-hidden="true" size={16} />
              </span>
            </SubmitButton>
          </form>
        ) : canRespond && interest.connectionId ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <form action={respondToConnectionAction}>
              <input name="connectionId" type="hidden" value={interest.connectionId} />
              <input name="returnTo" type="hidden" value={returnTo} />
              <input name="response" type="hidden" value="accepted" />
              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white transition hover:bg-[#176348]">
                <Check aria-hidden="true" size={16} />
                Accept
              </button>
            </form>
            <form action={respondToConnectionAction}>
              <input name="connectionId" type="hidden" value={interest.connectionId} />
              <input name="returnTo" type="hidden" value={returnTo} />
              <input name="response" type="hidden" value="declined" />
              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#ccd6d1] bg-white px-4 text-sm font-semibold text-[#263b35] transition hover:border-[#8faf9f]">
                <X aria-hidden="true" size={16} />
                Decline
              </button>
            </form>
          </div>
        ) : (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-[#60716b]">
            <Clock aria-hidden="true" size={16} />
            {interest.connectionStatus === "accepted"
              ? "Both sides can now continue the conversation in a connected context."
              : "The connection state is tracked separately from the interest record."}
          </p>
        )}
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-xs font-semibold uppercase text-[#789088]">{label}</p>
      <p className="mt-1 text-[#334942]">{value || "Not provided"}</p>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { reviewProposalAction } from "../actions";
import { requireAdminSession } from "../../../lib/auth";
import { getProposalById } from "../../../lib/proposals";

export default async function ProposalDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const proposal = await getProposalById(id).catch(() => null);

  if (!proposal) {
    notFound();
  }

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Manual review</p>
          <h1>{proposal.title}</h1>
        </div>
        <Link className="secondary-button" href="/proposals">
          Back to proposals
        </Link>
      </header>

      <section className="detail-grid">
        <article className="panel">
          <p className="eyebrow">Proposal</p>
          <dl className="detail-list">
            <Detail label="Description" value={proposal.description} />
            <Detail label="Host" value={proposal.hostHouseholdName ?? "Host"} />
            <Detail label="Area" value={proposal.areaLabel} />
            <Detail label="Status" value={proposal.status} />
            <Detail label="Review" value={proposal.manualReviewStatus} />
            <Detail label="Visibility" value={proposal.visibility} />
            <Detail label="Venue type" value={proposal.venueType} />
            <Detail label="Venue privacy" value={proposal.venuePrivacy} />
            <Detail
              label="Public location"
              value={proposal.publicLocationName ?? "Not provided"}
            />
            <Detail
              label="Private address"
              value={
                proposal.privateAddress
                  ? "Stored privately; not shown publicly"
                  : "Not provided"
              }
            />
            <Detail
              label="Target age bands"
              value={proposal.targetAgeBands.join(", ") || "Not selected"}
            />
            <Detail
              label="Capacity"
              value={[
                proposal.desiredFamilyCountMin || proposal.desiredFamilyCountMax
                  ? `${proposal.desiredFamilyCountMin ?? "?"}-${
                      proposal.desiredFamilyCountMax ?? "?"
                    } families`
                  : null,
                proposal.maxAdults ? `${proposal.maxAdults} adults` : null,
                proposal.maxChildren !== null
                  ? `${proposal.maxChildren} children`
                  : null,
                proposal.interestLimit
                  ? `${proposal.interestLimit} interest limit`
                  : null
              ]
                .filter(Boolean)
                .join(" · ")}
            />
            <Detail
              label="Flexibility"
              value={[
                proposal.flexibleTime ? "time" : null,
                proposal.flexibleLocation ? "location" : null,
                proposal.flexibleFood ? "food" : null
              ]
                .filter(Boolean)
                .join(", ")}
            />
            <Detail
              label="Food notes"
              value={proposal.foodNotes ?? "Not provided"}
            />
            <Detail
              label="Activity notes"
              value={proposal.activityNotes ?? "Not provided"}
            />
            <Detail
              label="Moderator notes"
              value={proposal.manualReviewNotes ?? "No notes yet"}
            />
          </dl>
        </article>

        <aside className="panel">
          <p className="eyebrow">Decision</p>
          <h2>Review action</h2>
          <form action={reviewProposalAction} className="form-stack">
            <input name="id" type="hidden" value={proposal.id} />
            <label>
              <span>Moderator notes</span>
              <textarea
                defaultValue={proposal.manualReviewNotes ?? ""}
                name="notes"
                placeholder="Add notes for internal review context"
                rows={7}
              />
            </label>
            <div className="button-row">
              <button name="action" type="submit" value="approve">
                Approve
              </button>
              <button
                className="secondary-button"
                name="action"
                type="submit"
                value="needs_changes"
              >
                Needs changes
              </button>
              <button
                className="danger-button"
                name="action"
                type="submit"
                value="reject"
              >
                Reject
              </button>
            </div>
          </form>
        </aside>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value || "Not provided"}</dd>
    </>
  );
}

import Link from "next/link";

import { requireAdminSession } from "../../lib/auth";
import { getPendingProposals } from "../../lib/proposals";

export default async function ProposalsPage() {
  await requireAdminSession();
  const proposals = await getPendingProposals();

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Manual review</p>
          <h1>Pending proposals</h1>
        </div>
        <Link className="secondary-button" href="/dashboard">
          Dashboard
        </Link>
      </header>

      {proposals.length > 0 ? (
        <section className="list-stack">
          {proposals.map((proposal) => (
            <Link
              className="list-row"
              href={`/proposals/${proposal.id}`}
              key={proposal.id}
            >
              <span>
                <strong>{proposal.title}</strong>
                <small>
                  {proposal.areaLabel} · {proposal.hostHouseholdName ?? "Host"} ·{" "}
                  {formatDate(proposal.createdAt)}
                </small>
              </span>
              <em>{proposal.manualReviewStatus}</em>
            </Link>
          ))}
        </section>
      ) : (
        <section className="panel">
          <p className="muted">No proposals are waiting for review.</p>
        </section>
      )}
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

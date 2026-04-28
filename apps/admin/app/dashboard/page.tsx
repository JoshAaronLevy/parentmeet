import Link from "next/link";

import { logoutAction } from "../actions";
import { requireAdminSession } from "../../lib/auth";
import { getPendingProposals } from "../../lib/proposals";

export default async function DashboardPage() {
  const session = await requireAdminSession();
  const pendingProposals = await getPendingProposals();

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">ParentMeet Internal</p>
          <h1>Dashboard</h1>
        </div>
        <form action={logoutAction}>
          <button className="secondary-button" type="submit">
            Sign out
          </button>
        </form>
      </header>

      <section className="status-grid">
        <div>
          <span className="label">Role</span>
          <strong>{session.role}</strong>
        </div>
        <div>
          <span className="label">Pending review</span>
          <strong>{pendingProposals.length}</strong>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Proposal review</h2>
          <Link href="/proposals">View all</Link>
        </div>
        {pendingProposals.length > 0 ? (
          <div className="list-stack">
            {pendingProposals.slice(0, 5).map((proposal) => (
              <Link
                className="list-row"
                href={`/proposals/${proposal.id}`}
                key={proposal.id}
              >
                <span>
                  <strong>{proposal.title}</strong>
                  <small>
                    {proposal.areaLabel} · {proposal.hostHouseholdName ?? "Host"}
                  </small>
                </span>
                <em>{proposal.manualReviewStatus}</em>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">No proposals are waiting for review.</p>
        )}
      </section>
    </main>
  );
}

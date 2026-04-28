import { APP_NAME, LOCAL_AREAS } from "@parentmeet/shared";

export default function AdminLandingPage() {
  return (
    <main className="page-shell">
      <section className="panel" aria-labelledby="admin-title">
        <p className="eyebrow">{APP_NAME} Internal</p>
        <h1 id="admin-title">Admin review workspace</h1>
        <p className="lede">
          Protected admin access will live here once Supabase authentication and
          moderator roles are configured.
        </p>
        <div className="status-grid">
          <div>
            <span className="label">Access</span>
            <strong>Protected placeholder</strong>
          </div>
          <div>
            <span className="label">Pilot areas</span>
            <strong>{LOCAL_AREAS.length}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SermonManager from "../components/admin/SermonManager";
import { MembersTable, VisitorsTable, SubscribersList } from "../components/admin/PeopleTables";

const tabs = [
  { id: "sermons", label: "Sermons", Panel: SermonManager },
  { id: "members", label: "Members", Panel: MembersTable },
  { id: "visitors", label: "First-timers", Panel: VisitorsTable },
  { id: "subscribers", label: "Newsletter", Panel: SubscribersList },
];

export default function AdminPage() {
  const { user, isAdmin, checking } = useAuth();
  const location = useLocation();
  const [active, setActive] = useState("sermons");

  if (checking) return <p className="wrap py-20 text-ash">Checking your login…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) {
    return (
      <section className="wrap py-24">
        <h1 className="display text-6xl text-stone">Admins only</h1>
        <p className="mt-4 max-w-lg text-lg text-stone/80">
          This page is for the church media team. If you should have access, ask an existing admin to make you an admin
          from the Members tab.
        </p>
      </section>
    );
  }

  const { Panel } = tabs.find((t) => t.id === active);

  return (
    <section className="bg-ink">
      <div className="wrap py-12 md:py-16">
        <h1 className="display text-6xl text-stone md:text-7xl">Admin</h1>
        <p className="mt-2 text-ash">Signed in as {user.name}.</p>
        <div role="tablist" aria-label="Admin sections" className="mt-8 flex flex-wrap gap-2 border-b border-stone/15 pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === t.id ? "bg-flame text-ink" : "text-stone/80 hover:bg-stone/10 hover:text-stone"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="mt-8">
          <Panel />
        </div>
      </div>
    </section>
  );
}

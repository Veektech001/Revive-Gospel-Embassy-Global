import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import CopyButton from "../shared/CopyButton";

const shortDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

function useList(path, key) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const load = useCallback(() => {
    api(path)
      .then((d) => {
        setItems(d[key]);
        setStatus("ready");
      })
      .catch((e) => {
        setError(e.message);
        setStatus("error");
      });
  }, [path, key]);
  useEffect(load, [load]);
  return { items, status, error, reload: load };
}

function Table({ head, children, empty, status, error, count }) {
  if (status === "loading") return <p className="text-ash">Loading…</p>;
  if (status === "error") return <p className="text-flame">{error}</p>;
  if (!count) return <p className="text-ash">{empty}</p>;
  return (
    <div className="overflow-x-auto rounded-sm border border-stone/15">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="bg-coal text-ash">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone/10 text-stone">{children}</tbody>
      </table>
    </div>
  );
}

export function MembersTable() {
  const { user: me } = useAuth();
  const { items, status, error, reload } = useList("/api/users", "users");
  const [message, setMessage] = useState("");

  async function setRole(u, role) {
    try {
      await api(`/api/users/${u.id}/role`, { method: "PATCH", body: { role } });
      setMessage(`${u.name} is now ${role === "admin" ? "an admin" : "a member"}.`);
      reload();
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <div className="grid gap-4">
      <p className="text-ash">{items.length ? `${items.length} registered ${items.length === 1 ? "account" : "accounts"}.` : ""} Admins can upload sermons and see this page.</p>
      {message && <p role="status" className="text-stone">{message}</p>}
      <Table head={["Name", "Email", "Phone", "Joined", "Role"]} empty="No one has signed up yet." status={status} error={error} count={items.length}>
        {items.map((u) => (
          <tr key={u.id}>
            <td className="px-4 py-3 font-semibold">{u.name}</td>
            <td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3">{u.phone}</td>
            <td className="whitespace-nowrap px-4 py-3">{shortDate(u.createdAt)}</td>
            <td className="px-4 py-3">
              {u.id === me?.id ? (
                <span className="text-ash">Admin (you)</span>
              ) : (
                <button
                  type="button"
                  className="rounded-full border border-stone/30 px-3 py-1.5 text-xs font-semibold hover:border-stone"
                  onClick={() => setRole(u, u.role === "admin" ? "member" : "admin")}
                >
                  {u.role === "admin" ? "Admin · Remove admin" : "Member · Make admin"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export function VisitorsTable() {
  const { items, status, error, reload } = useList("/api/visitors", "visitors");

  async function toggle(v) {
    await api(`/api/visitors/${v._id}`, { method: "PATCH", body: { followedUp: !v.followedUp } }).catch(() => {});
    reload();
  }

  return (
    <Table head={["Followed up", "Name", "Contact", "Visiting", "Question"]} empty="No first-timer forms yet." status={status} error={error} count={items.length}>
      {items.map((v) => (
        <tr key={v._id} className="align-top">
          <td className="px-4 py-3">
            <input
              type="checkbox"
              checked={v.followedUp}
              onChange={() => toggle(v)}
              className="h-5 w-5 accent-flame"
              aria-label={`Mark ${v.name} as followed up`}
            />
          </td>
          <td className="px-4 py-3">
            <p className="font-semibold">{v.name}</p>
            <p className="text-ash">Sent {shortDate(v.createdAt)}</p>
          </td>
          <td className="px-4 py-3">
            {v.phone && <p>{v.phone}</p>}
            {v.email && <p className="break-all">{v.email}</p>}
            {v.address && <p className="text-ash">{v.address}</p>}
          </td>
          <td className="whitespace-nowrap px-4 py-3">
            {v.service}
            {v.visitDate && <p className="text-ash">{shortDate(v.visitDate)}</p>}
          </td>
          <td className="max-w-xs px-4 py-3 text-stone/80">{v.question}</td>
        </tr>
      ))}
    </Table>
  );
}

export function SubscribersList() {
  const { items, status, error } = useList("/api/newsletter", "subscribers");
  const all = items.map((s) => s.email).join(", ");
  return (
    <div className="grid gap-4">
      {items.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-ash">{items.length} subscribers.</p>
          <CopyButton text={all} label="Copy all emails" />
        </div>
      )}
      <Table head={["Email", "Subscribed"]} empty="No newsletter subscribers yet." status={status} error={error} count={items.length}>
        {items.map((s) => (
          <tr key={s._id}>
            <td className="px-4 py-3">{s.email}</td>
            <td className="px-4 py-3">{shortDate(s.createdAt)}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

import { useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import CopyButton from "../components/shared/CopyButton";
import giving from "../data/giving";
import { church } from "../data/church";

function Detail({ label, value, copy }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink/15 py-4 last:border-0">
      <div className="min-w-0">
        <dt className="text-sm text-ink/60">{label}</dt>
        <dd className={`mt-0.5 break-words font-semibold ${copy && value ? "font-anton text-3xl tabular-nums tracking-wide" : "text-lg"}`}>
          {value || <span className="font-montserrat text-base font-medium text-ink/50">Details coming soon</span>}
        </dd>
      </div>
      {copy && value && <CopyButton text={value} label="Copy number" />}
    </div>
  );
}

export default function GivePage() {
  const [activeId, setActiveId] = useState(giving[0].id);
  const active = giving.find((g) => g.id === activeId);

  return (
    <>
      <PageHeader
        title="Give"
        intro="Thank you for partnering with what God is doing through Revive Gospel Embassy. Choose what you're giving towards to see the account details."
      />

      <section className="bg-ink">
        <div className="wrap grid gap-10 py-20 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-28">
          <div>
            <h2 className="mb-5 text-sm font-semibold text-ash" id="give-type">
              I'm giving towards
            </h2>
            <div role="tablist" aria-labelledby="give-type" className="flex flex-col gap-2">
              {giving.map((g) => {
                const selected = g.id === activeId;
                return (
                  <button
                    key={g.id}
                    role="tab"
                    id={`tab-${g.id}`}
                    aria-selected={selected}
                    aria-controls="give-panel"
                    onClick={() => setActiveId(g.id)}
                    className={`display rounded-sm border px-5 py-4 text-left text-4xl transition-colors ${
                      selected
                        ? "border-flame bg-flame text-ink"
                        : "border-stone/20 text-stone hover:border-stone/60"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div id="give-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="min-w-0">
            <div className="rounded-sm bg-stone p-6 text-ink md:p-10">
              <h2 className="display text-5xl">{active.label}</h2>
              <p className="mt-3 text-ink/75">{active.text}</p>
              <dl className="mt-6">
                <Detail label="Bank" value={active.bank} />
                <Detail label="Account name" value={active.accountName} />
                <Detail label="Account number" value={active.accountNumber} copy />
              </dl>
            </div>
            <p className="mt-6 text-sm text-ash">
              Questions about giving? Call {church.phone} or email {church.email}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import { useState } from "react";
import welcomeImage from "../assets/Images/BI.jpg";
import PageHeader from "../components/shared/PageHeader";
import LeaderCard from "../components/shared/LeaderCard";
import VisitorForm from "../components/shared/VisitorForm";
import leaders from "../data/leaders";
import { church } from "../data/church";

const faqs = [
  {
    q: "When and where do you meet?",
    a: `Sunday service starts at 8:00 AM and Friday service at 4:30 PM, at the ${church.venue.lines.join(", ")}.`,
  },
  {
    q: "What should I wear?",
    a: "Come as you are. Our services are informal, so wear whatever you're comfortable in.",
  },
  {
    q: "What is a service like?",
    a: "Expect lively worship, prayer and faithful teaching from the Bible. Services are full of energy and everyone is welcome to take part.",
  },
  {
    q: "Who do I talk to when I arrive?",
    a: "Our ushers will welcome you at the door. Let them know it's your first time and they'll introduce you to Pastor Joy and the first-timers team.",
  },
];

export default function FirstTimePage() {
  const joy = leaders.find((l) => l.id === "joy");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <PageHeader
        title="First time?"
        intro="We can't wait to meet you. Here's what to expect, and how to let us know you're coming."
        image={{ src: welcomeImage, alt: "Worship on the RGE stage" }}
      />

      <section className="bg-ink">
        <div className="wrap grid gap-12 py-20 md:grid-cols-[1fr_1.2fr] md:gap-16 md:py-28">
          <h2 className="display text-5xl text-stone md:text-6xl">What to expect</h2>
          <div className="divide-y divide-stone/15 border-y border-stone/15">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-stone hover:text-flame"
                    >
                      {f.q}
                      <span
                        aria-hidden="true"
                        className={`text-2xl leading-none text-flame transition-transform ${open ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  <p id={`faq-${i}`} hidden={!open} className="pb-6 pr-10 text-stone/80">
                    {f.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-coal">
        <div className="wrap py-20 md:py-28">
          <LeaderCard leader={joy}>
            <a href="#visit-form" className="btn-flame mt-8">
              Let Pastor Joy know you're coming
            </a>
          </LeaderCard>
        </div>
      </section>

      <section id="visit-form" className="scroll-mt-16 bg-ink">
        <div className="wrap grid gap-10 py-20 md:grid-cols-[1fr_1.6fr] md:gap-16 md:py-28">
          <div>
            <h2 className="display text-5xl text-stone md:text-6xl">Plan your visit</h2>
            <p className="mt-4 text-lg text-stone/80">
              Share a few details and our first-timers team will reach out to welcome you before
              you come.
            </p>
          </div>
          <VisitorForm />
        </div>
      </section>
    </>
  );
}

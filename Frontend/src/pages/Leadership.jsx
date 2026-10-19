import pastorsImage from "../assets/Images/fourthHero.jpg";
import PageHeader from "../components/shared/PageHeader";
import LeaderCard from "../components/shared/LeaderCard";
import leaders from "../data/leaders";

export default function LeadershipPage() {
  return (
    <>
      <PageHeader
        title="Leadership"
        intro="The shepherds God has set over the house, building a church where people encounter Him and become more like Jesus."
        image={{ src: pastorsImage, alt: "Members of RGE in prayer" }}
      />
      <section className="bg-ink">
        <div className="wrap flex flex-col gap-20 py-20 md:gap-28 md:py-28">
          {leaders.map((leader, i) => (
            <LeaderCard key={leader.id} leader={leader} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  );
}

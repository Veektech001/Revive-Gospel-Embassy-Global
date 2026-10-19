import Hero from "../components/home/Hero";
import Welcome from "../components/home/Welcome";
import PrayerWatch from "../components/home/PrayerWatch";
import JoinGroups from "../components/home/JoinGroups";
import LatestSermons from "../components/home/LatestSermons";
import VisionMission from "../components/shared/VisionMission";
import Newsletter from "../components/shared/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Welcome />
      <PrayerWatch />
      <VisionMission />
      <JoinGroups />
      <LatestSermons />
      <Newsletter />
    </>
  );
}

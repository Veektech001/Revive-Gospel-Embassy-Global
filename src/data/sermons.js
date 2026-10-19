import secondHero from "../assets/Images/secondHero.jpg";
import firstHero from "../assets/Images/firstHero.jpg";
import serve from "../assets/Images/serve.jpg";

// TODO: replace these sample sermons with real ones.
// date: YYYY-MM-DD
// audioUrl: link to the audio file (Google Drive, Telegram, etc.). Leave "" if not uploaded yet.
// sample: true shows a "Sample" badge so visitors know it is placeholder content.
const sermons = [
  {
    id: "faith",
    title: "Faith",
    series: "Foundations",
    speaker: "Apostle Light Iwuh",
    date: "2026-02-12",
    image: { src: secondHero, alt: "Apostle Light Iwuh preaching" },
    audioUrl: "",
    sample: true,
  },
  {
    id: "godliness",
    title: "Godliness",
    series: "Foundations",
    speaker: "Apostle Light Iwuh",
    date: "2026-01-25",
    image: { src: firstHero, alt: "Minister on the RGE stage" },
    audioUrl: "",
    sample: true,
  },
  {
    id: "love",
    title: "Love",
    series: "Becoming Like Jesus",
    speaker: "Apostle Light Iwuh",
    date: "2025-12-02",
    image: { src: serve, alt: "Choir ministering at RGE" },
    audioUrl: "",
    sample: true,
  },
];

// Newest first
export default [...sermons].sort((a, b) => b.date.localeCompare(a.date));

export function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

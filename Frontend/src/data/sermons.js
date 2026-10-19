import secondHero from "../assets/Images/secondHero.jpg";
import firstHero from "../assets/Images/firstHero.jpg";
import serve from "../assets/Images/serve.jpg";

// Sample sermons, shown only when the website is NOT connected to the backend
// (no VITE_API_URL). Once the backend is running, real sermons are uploaded
// from the Admin page and this list is no longer used.
const sermons = [
  {
    id: "faith",
    title: "Faith",
    series: "Foundations",
    speaker: "Apostle Light Iwuh",
    date: "2026-02-12",
    imageUrl: secondHero,
    hasAudio: false,
    sample: true,
  },
  {
    id: "godliness",
    title: "Godliness",
    series: "Foundations",
    speaker: "Apostle Light Iwuh",
    date: "2026-01-25",
    imageUrl: firstHero,
    hasAudio: false,
    sample: true,
  },
  {
    id: "love",
    title: "Love",
    series: "Becoming Like Jesus",
    speaker: "Apostle Light Iwuh",
    date: "2025-12-02",
    imageUrl: serve,
    hasAudio: false,
    sample: true,
  },
];

// Newest first
export const sampleSermons = [...sermons].sort((a, b) => b.date.localeCompare(a.date));

export const defaultSermonImage = secondHero;

export function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

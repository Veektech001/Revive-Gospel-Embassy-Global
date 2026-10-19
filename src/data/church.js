// ─────────────────────────────────────────────────────────────
// All church details live here. Edit this file and every page
// that shows these details updates automatically.
// Anything marked TODO is still waiting for real information.
// ─────────────────────────────────────────────────────────────

export const church = {
  name: "Revive Gospel Embassy",
  shortName: "RGE",
  tagline: "…to infect men with the undying fire and zeal for the kingdom of God.",
  vision: "To infect men with the undying fire and zeal for the kingdom of God.",
  mission:
    "To set territories burning for the kingdom without reservation and denominational bias.",

  phone: "+234 706 750 2417",
  phoneHref: "tel:+2347067502417",
  email: "ezev2682@gmail.com",

  // Where Sunday and Friday services hold
  venue: {
    label: "Service venue",
    lines: ["SUG Complex, behind ESUT Senior Staff Club", "Agbani, Enugu State"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=SUG+Complex+ESUT+Agbani+Enugu",
  },

  // Head office
  headquarters: {
    label: "Headquarters",
    lines: ["Beside Omar's Lodge", "Agbani, Enugu State"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Omar%27s+Lodge+Agbani+Enugu",
  },

  services: [
    { day: "Sunday", time: "8:00 AM", name: "Sunday Service" },
    { day: "Friday", time: "4:30 PM", name: "Friday Service" },
    { day: "Every day", time: "1:00 AM", name: "Daily Prayer Watch" },
  ],

  // TODO: add real social media links (leave "" to hide an icon)
  socials: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
};

export const navLinks = [
  { to: "/about", label: "About" },
  { to: "/sermons", label: "Sermons" },
  { to: "/leadership", label: "Leadership" },
  { to: "/first-time", label: "First time?" },
  { to: "/give", label: "Give" },
];
